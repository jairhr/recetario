# Bitácora de Vibe Coding - Recetario

## Herramienta de IA utilizada (opencode + modelo)

- Herramienta: OpenCode
- Modelo: DeepSeek V4.1 Flash Free (`opencode/deepseek-v4.1-flash-free`)
- Fecha: 14 de noviembre de 2026

## Iteración 1

**Objetivo:** Definir las reglas de arquitectura, tipado, estilos, manejo de datos y configuración del proyecto antes de implementar la aplicación. En esta iteración solo se planifica y documenta; no se genera código de la app.

**Prompt utilizado:**

```text
Contexto: estoy construyendo "Recetario", una app Next.js (App Router, TypeScript, Tailwind CSS) para una actividad evaluada de Vibe Coding. Revisa el proyecto actual y respeta estas reglas en todo lo que generes:

1. Usa App Router con carpeta src/app. No uses pages router.
2. Por defecto todo es Server Component. Usa "use client" solo donde se necesite interactividad o hooks (useState, useEffect).
3. TypeScript estricto: sin `any`, con tipos definidos en src/types.
4. Estilos solo con Tailwind, diseño responsive mobile-first.
5. Cada ruta de datos debe tener su loading.tsx y error.tsx.
6. Las claves o configuraciones sensibles van en .env.local y se documentan en .env.example.
7. Antes de escribir código, explica en 3-5 líneas qué vas a hacer.

Rutas objetivo: / , /recetas , /recetas/[id] , /favoritos , /acerca.
Fuente de datos: API pública TheMealDB (https://www.themealdb.com/api.php) consumida mediante Route Handlers propios en src/app/api.

No generes código todavía. Confirma que entendiste las reglas y actualiza AGENTS.md añadiéndolas.
```

**Resultado:** Se revisó el repositorio y se actualizó `AGENTS.md` con las reglas del proyecto, las rutas objetivo y el flujo de datos. No se crearon rutas, componentes, Route Handlers, tipos ni `.env.example`; la implementación queda para la siguiente iteración.

**Correcciones / decisiones técnicas:**

- Se conservó el bloque administrado por Next.js al inicio de `AGENTS.md`; `next dev` lo reescribe y no debe eliminarse.
- Se añadió una excepción explícita a la regla de Server Components: `error.tsx` debe ser Client Component por requisito de Next.js.
- Se documentó que los Client Components no deben llamar a TheMealDB directamente. El flujo será: navegador → Route Handlers propios en `src/app/api/...` → TheMealDB.
- Se mantuvo la regla de tipos compartidos en `src/types/` y el uso de `unknown` con narrowing en lugar de `any`.
- Se dejó constancia de que el proyecto usa Next.js 16.4.6 con `cacheComponents` y `partialPrefetching` activos, por lo que no deben añadirse configuraciones de segmento como `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` o `runtime`.

## Desafíos y cómo se resolvieron

- **`.env.example` estaba siendo ignorado:** `.gitignore` usa el patrón `.env*`, que también excluye `.env.example`. Se documentó la necesidad de agregar una excepción `!.env.example` (o usar `git add -f`) para que la plantilla sí se versione.
- **Conflicto aparente entre Server Components y `error.tsx`:** la regla general indica usar `"use client"` solo para interactividad, pero los boundaries de error de Next.js exigen un Client Component. Se resolvió dejando la excepción escrita en `AGENTS.md`.
- **Next.js 16 reescribe `AGENTS.md`:** el bloque de reglas para agentes se regenera con `next dev`. En lugar de eliminarlo o duplicarlo, se preservó y se añadió el contenido propio debajo.
- **Sin runner de tests ni script de typecheck:** el proyecto solo trae `dev`, `build` y `lint`. Se documentó el comando `npx next typegen && npx tsc --noEmit` para verificar tipos y se aclaró que no hay pruebas automatizadas configuradas.
- **Bloqueo de PowerShell sobre `npm.ps1`/`npx.ps1`:** en este entorno de Windows los shims de PowerShell pueden estar bloqueados por la política de ejecución. Se documentó el uso de `npm.cmd`, `npx.cmd` o `cmd /c "npm ..."` como alternativa.
