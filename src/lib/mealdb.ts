import type {
  Categoria,
  Ingrediente,
  Receta,
  RecetaResumen,
} from "@/types/receta";

const MEALDB_API_URL_POR_DEFECTO =
  "https://www.themealdb.com/api/json/v1/1";

export class MealDBError extends Error {
  constructor(message = "No se pudo consultar TheMealDB.") {
    super(message);
    this.name = "MealDBError";
  }
}

function obtenerBaseUrl(): string {
  const configurada = process.env.MEALDB_API_URL?.trim();

  return (configurada || MEALDB_API_URL_POR_DEFECTO).replace(/\/+$/, "");
}

async function consultarTheMealDB(recurso: string): Promise<unknown> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${obtenerBaseUrl()}/${recurso}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new MealDBError("No se pudo conectar con TheMealDB.");
  }

  if (!respuesta.ok) {
    throw new MealDBError(
      `TheMealDB respondió con el estado ${respuesta.status}.`,
    );
  }

  try {
    const datos: unknown = await respuesta.json();
    return datos;
  } catch {
    throw new MealDBError("TheMealDB devolvió una respuesta no válida.");
  }
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function leerTexto(registro: Record<string, unknown>, clave: string): string {
  const valor = registro[clave];

  return typeof valor === "string" ? valor : "";
}

function leerTextoOpcional(
  registro: Record<string, unknown>,
  clave: string,
): string | undefined {
  const valor = leerTexto(registro, clave).trim();

  return valor.length > 0 ? valor : undefined;
}

function extraerMeals(datos: unknown): unknown[] {
  if (!esObjeto(datos)) {
    throw new MealDBError("TheMealDB devolvió una respuesta inesperada.");
  }

  const meals = datos.meals;

  if (meals === null || meals === undefined) {
    return [];
  }

  if (!Array.isArray(meals)) {
    throw new MealDBError("TheMealDB devolvió una lista de recetas inválida.");
  }

  const mealsValidos: unknown[] = meals;
  return mealsValidos;
}

function normalizarReceta(valor: unknown): Receta | null {
  if (!esObjeto(valor)) {
    return null;
  }

  const id = leerTexto(valor, "idMeal");
  const nombre = leerTexto(valor, "strMeal");

  if (!id || !nombre) {
    return null;
  }

  const ingredientes: Ingrediente[] = [];

  for (let indice = 1; indice <= 20; indice += 1) {
    const ingrediente = leerTexto(valor, `strIngredient${indice}`).trim();

    if (!ingrediente) {
      continue;
    }

    ingredientes.push({
      ingrediente,
      medida: leerTexto(valor, `strMeasure${indice}`).trim(),
    });
  }

  const youtube = leerTextoOpcional(valor, "strYoutube");

  return {
    id,
    nombre,
    categoria: leerTexto(valor, "strCategory"),
    area: leerTexto(valor, "strArea"),
    instrucciones: leerTexto(valor, "strInstructions"),
    imagen: leerTexto(valor, "strMealThumb"),
    ingredientes,
    ...(youtube ? { youtube } : {}),
  };
}

function normalizarCategoria(valor: unknown): Categoria | null {
  if (!esObjeto(valor)) {
    return null;
  }

  const id = leerTexto(valor, "idCategory");
  const nombre = leerTexto(valor, "strCategory");

  if (!id || !nombre) {
    return null;
  }

  return {
    id,
    nombre,
    imagen: leerTexto(valor, "strCategoryThumb"),
    descripcion: leerTexto(valor, "strCategoryDescription"),
  };
}

function normalizarRecetas(valores: unknown[]): Receta[] {
  const recetas: Receta[] = [];

  for (const valor of valores) {
    const receta = normalizarReceta(valor);

    if (receta) {
      recetas.push(receta);
    }
  }

  return recetas;
}

function aResumen(receta: Receta): RecetaResumen {
  return {
    id: receta.id,
    nombre: receta.nombre,
    imagen: receta.imagen,
  };
}

export async function buscarRecetas(q: string): Promise<RecetaResumen[]> {
  const consulta = q.trim();
  const datos = await consultarTheMealDB(
    `search.php?s=${encodeURIComponent(consulta)}`,
  );

  return normalizarRecetas(extraerMeals(datos)).map(aResumen);
}

export async function obtenerReceta(id: string): Promise<Receta | null> {
  const datos = await consultarTheMealDB(
    `lookup.php?i=${encodeURIComponent(id.trim())}`,
  );

  const [receta] = normalizarRecetas(extraerMeals(datos));
  return receta ?? null;
}

export async function listarCategorias(): Promise<Categoria[]> {
  const datos = await consultarTheMealDB("categories.php");

  if (!esObjeto(datos) || !Array.isArray(datos.categories)) {
    throw new MealDBError(
      "TheMealDB devolvió una lista de categorías inválida.",
    );
  }

  const categoriasValidas: unknown[] = datos.categories;
  const categorias: Categoria[] = [];

  for (const valor of categoriasValidas) {
    const categoria = normalizarCategoria(valor);

    if (categoria) {
      categorias.push(categoria);
    }
  }

  return categorias;
}

export async function recetaAleatoria(): Promise<Receta> {
  const datos = await consultarTheMealDB("random.php");
  const [receta] = normalizarRecetas(extraerMeals(datos));

  if (!receta) {
    throw new MealDBError("TheMealDB no devolvió una receta aleatoria.");
  }

  return receta;
}
