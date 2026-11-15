import { respuestaError } from "@/lib/api";
import { recetaAleatoria } from "@/lib/mealdb";

export async function GET() {
  try {
    const receta = await recetaAleatoria();
    return Response.json({ receta });
  } catch (error) {
    return respuestaError(error);
  }
}
