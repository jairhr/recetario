import { respuestaError } from "@/lib/api";
import { listarCategorias } from "@/lib/mealdb";

export async function GET() {
  try {
    const categorias = await listarCategorias();
    return Response.json({ categorias });
  } catch (error) {
    return respuestaError(error);
  }
}
