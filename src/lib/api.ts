import { MealDBError } from "@/lib/mealdb";

export function respuestaError(error: unknown): Response {
  if (error instanceof MealDBError) {
    return Response.json({ error: error.message }, { status: 502 });
  }

  console.error("Error inesperado en la API de Recetario:", error);

  return Response.json(
    { error: "Error interno del servidor." },
    { status: 500 },
  );
}
