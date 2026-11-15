import { useCallback, useEffect, useState } from "react";

const CLAVE_ALMACENAMIENTO = "recetario:favoritos";
const EVENTO_FAVORITOS = "recetario:favoritos:cambio";

function leerFavoritos(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const crudo = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);

    if (!crudo) {
      return [];
    }

    const datos: unknown = JSON.parse(crudo);

    if (!Array.isArray(datos)) {
      return [];
    }

    const ids: string[] = [];

    for (const valor of datos) {
      if (typeof valor === "string" && valor.trim() && !ids.includes(valor)) {
        ids.push(valor);
      }
    }

    return ids;
  } catch {
    return [];
  }
}

function escribirFavoritos(ids: string[]): void {
  try {
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(ids));
  } catch {
    // El almacenamiento puede estar deshabilitado o lleno.
  }
}

export interface Favoritos {
  favoritos: string[];
  hidratado: boolean;
  esFavorito: (id: string) => boolean;
  alternarFavorito: (id: string) => void;
  quitarFavorito: (id: string) => void;
}

export function useFavoritos(): Favoritos {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    const sincronizar = () => setFavoritos(leerFavoritos());

    // Se lee tras el primer render para no romper la hidratación.
    const temporizador = setTimeout(() => {
      sincronizar();
      setHidratado(true);
    }, 0);

    const alCambiarAlmacen = (evento: StorageEvent) => {
      if (evento.key === null || evento.key === CLAVE_ALMACENAMIENTO) {
        sincronizar();
      }
    };

    window.addEventListener("storage", alCambiarAlmacen);
    window.addEventListener(EVENTO_FAVORITOS, sincronizar);

    return () => {
      clearTimeout(temporizador);
      window.removeEventListener("storage", alCambiarAlmacen);
      window.removeEventListener(EVENTO_FAVORITOS, sincronizar);
    };
  }, []);

  const esFavorito = useCallback(
    (id: string) => favoritos.includes(id),
    [favoritos],
  );

  const alternarFavorito = useCallback((id: string) => {
    const actuales = leerFavoritos();
    const siguiente = actuales.includes(id)
      ? actuales.filter((favorito) => favorito !== id)
      : [...actuales, id];

    escribirFavoritos(siguiente);
    setFavoritos(siguiente);
    window.dispatchEvent(new Event(EVENTO_FAVORITOS));
  }, []);

  const quitarFavorito = useCallback((id: string) => {
    const actuales = leerFavoritos();

    if (!actuales.includes(id)) {
      return;
    }

    const siguiente = actuales.filter((favorito) => favorito !== id);

    escribirFavoritos(siguiente);
    setFavoritos(siguiente);
    window.dispatchEvent(new Event(EVENTO_FAVORITOS));
  }, []);

  return {
    favoritos,
    hidratado,
    esFavorito,
    alternarFavorito,
    quitarFavorito,
  };
}
