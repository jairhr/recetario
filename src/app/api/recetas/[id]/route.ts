import { respuestaError } from "@/lib/api";
import { obtenerReceta } from "@/lib/mealdb";

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
