"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/recetas", etiqueta: "Recetas" },
  { href: "/favoritos", etiqueta: "Favoritos" },
  { href: "/acerca", etiqueta: "Acerca" },
] as const;

function esEnlaceActivo(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function clasesEnlace(activo: boolean, movil: boolean): string {
  const base = movil
    ? "flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
    : "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700";

  return activo
    ? `${base} bg-orange-100 text-orange-900`
    : `${base} text-stone-600 hover:bg-stone-200/70 hover:text-stone-900`;
}

interface EnlacesProps {
  movil?: boolean;
  onNavigate?: () => void;
}

export function EnlacesNavegacion({
  movil = false,
  onNavigate,
}: EnlacesProps) {
  const pathname = usePathname();

  return (
    <>
      {ENLACES.map((enlace) => {
        const activo = esEnlaceActivo(pathname, enlace.href);

        return (
          <li key={enlace.href}>
            <Link
              href={enlace.href}
              onClick={onNavigate}
              aria-current={activo ? "page" : undefined}
              className={clasesEnlace(activo, movil)}
            >
              {enlace.etiqueta}
            </Link>
          </li>
        );
      })}
    </>
  );
}

export function EnlacesNavegacionEsqueleto({
  movil = false,
  onNavigate,
}: EnlacesProps) {
  return (
    <>
      {ENLACES.map((enlace) => (
        <li key={enlace.href}>
          <Link
            href={enlace.href}
            onClick={onNavigate}
            className={clasesEnlace(false, movil)}
          >
            {enlace.etiqueta}
          </Link>
        </li>
      ))}
    </>
  );
}
