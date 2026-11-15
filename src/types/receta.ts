export interface Ingrediente {
  ingrediente: string;
  medida: string;
}

export interface Receta {
  id: string;
  nombre: string;
  categoria: string;
  area: string;
  instrucciones: string;
  imagen: string;
  ingredientes: Ingrediente[];
  youtube?: string;
}

export type RecetaResumen = Pick<Receta, "id" | "nombre" | "imagen">;

export interface Categoria {
  id: string;
  nombre: string;
  imagen: string;
  descripcion: string;
}
