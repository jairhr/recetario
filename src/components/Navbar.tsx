"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    ? "block rounded-xl px-4 py-3 text-sm font-medium transition-colors"
    : "rounded-full px-4 py-2 text-sm font-medium transition-colors";

  return activo
    ? `${base} bg-orange-100 text-orange-900`
    : `${base} text-stone-600 hover:bg-stone-200/70 hover:text-stone-900`;
}

export function Navbar() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          onClick={cerrarMenu}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full bg-orange-700 text-sm font-semibold text-white"
          >
            R
          </span>
          Recetario
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {ENLACES.map((enlace) => {
            const activo = esEnlaceActivo(pathname, enlace.href);

            return (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  aria-current={activo ? "page" : undefined}
                  className={clasesEnlace(activo, false)}
                >
                  {enlace.etiqueta}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 md:hidden"
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          {menuAbierto ? (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {menuAbierto && (
        <div
          id="menu-movil"
          className="border-t border-stone-200 bg-stone-50 md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {ENLACES.map((enlace) => {
              const activo = esEnlaceActivo(pathname, enlace.href);

              return (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    onClick={cerrarMenu}
                    aria-current={activo ? "page" : undefined}
                    className={clasesEnlace(activo, true)}
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
