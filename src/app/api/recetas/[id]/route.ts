import { respuestaError } from "@/lib/api";
import { obtenerReceta } from "@/lib/mealdb";

/** TheMealDB usa IDs numéricos de hasta 6 dígitos (ej. 52772). */
const ID_VALIDO = /^\d{1,8}$/;

export async function GET(
  _request: Request,
  context: RouteContext<"/api/recetas/[id]">,
) {
  const { id } = await context.params;
  const recetaId = id.trim();

  if (!recetaId) {
    return Response.json(
      { error: "El id de la receta es obligatorio." },
      { status: 400 },
    );
  }

  if (!ID_VALIDO.test(recetaId)) {
    return Response.json(
      { error: "El id de la receta debe ser un número entero positivo." },
      { status: 400 },
    );
  }

  try {
    const receta = await obtenerReceta(recetaId);

    if (!receta) {
      return Response.json(
        { error: "Receta no encontrada." },
        { status: 404 },
      );
    }

    return Response.json({ receta });
  } catch (error) {
    return respuestaError(error);
  }
}
