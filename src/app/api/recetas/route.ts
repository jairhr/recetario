import type { NextRequest } from "next/server";
import { respuestaError } from "@/lib/api";
import { buscarRecetas } from "@/lib/mealdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return Response.json(
      { error: "El parámetro q es obligatorio." },
      { status: 400 },
    );
  }

  try {
    const recetas = await buscarRecetas(q);
    return Response.json({ recetas });
  } catch (error) {
    return respuestaError(error);
  }
}
