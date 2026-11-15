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

## Iteración 2 — Tipos, Route Handlers y portada

**Objetivo:** Construir la capa de datos y la primera pantalla de la aplicación.

**Prompt (resumen):** Definir los tipos de receta, el cliente de TheMealDB y Route Handlers propios bajo `src/app/api`; crear el layout global, Navbar, Footer y la portada con la receta del día, incluyendo `loading.tsx` y `error.tsx`.

**Resultado:** `src/types/receta.ts`, `src/lib/mealdb.ts` (normalización, búsqueda, filtro por categoría y `recetaAleatoria()`), `src/lib/api.ts` y cuatro Route Handlers (`/api/recetas`, `/api/recetas/[id]`, `/api/recetas/aleatoria`, `/api/categorias`). Layout, Navbar, Footer, `RecetaCard` y portada con la receta del día dentro de `<Suspense>`.

**Correcciones / decisiones técnicas:**

- Las imágenes remotas se limitaron a `https://www.themealdb.com/images/**` en `images.remotePatterns`.
- La fuente de datos se normaliza en el servidor; el navegador solo recibe el tipo `Receta`/`RecetaResumen`.
- Se documentaron las variables en `.env.example` y se añadió la excepción `!.env.example` a `.gitignore`.

## Iteración 3 — Listado con búsqueda y filtro

**Objetivo:** Implementar `/recetas` con búsqueda por nombre y filtro por categoría.

**Prompt (resumen):** Página de listado que lea `searchParams` (Promise en Next 16) dentro de `<Suspense>`, combine búsqueda y categoría, muestre estado vacío y tenga `loading.tsx`/`error.tsx`.

**Resultado:** `src/app/recetas/page.tsx` con filtro por categoría vía `filter.php`, búsqueda combinada en servidor, `BuscadorRecetas` con debounce de 400 ms y `router.replace`, y `GrillaEsqueleto` compartido para los estados de carga.

**Correcciones / decisiones técnicas:**

- `searchParams` debe resolverse dentro de `<Suspense>` para no bloquear el prerenderizado con Cache Components.
- Las navegaciones del buscador se guardan en estado porque las refs no pueden leerse durante el render (`react-hooks/refs`).
- El filtro de categoría por defecto es `chicken` para que la primera visita tenga contenido.

## Iteración 4 — Detalle de receta

**Objetivo:** Implementar `/recetas/[id]` con ingredientes, pasos y metadata dinámica.

**Prompt (resumen):** Server Component que obtenga la receta por id (`params` es una Promise), use `notFound()` si no existe, muestre imagen, nombre, categoría, región, ingredientes con medidas, instrucciones numeradas y YouTube; añadir `generateMetadata`, `not-found.tsx`, `loading.tsx`, `error.tsx` y dejar un hueco para el botón de favoritos.

**Resultado:** Página de detalle completa, `not-found.tsx`, `loading.tsx` y `error.tsx` propios. `generateMetadata` devuelve título, descripción y Open Graph con la imagen de la receta.

**Correcciones / decisiones técnicas:**

- El build falló porque `usePathname()` en el Navbar no puede prerenderizarse fuera de `<Suspense>` en una ruta dinámica. Los enlaces dependientes del pathname se movieron a `EnlacesNavegacion`, envuelto en `<Suspense>` con un fallback estático.
- Con `loading.tsx` el shell se transmite antes de resolver la receta, así que el 404 visual llega con HTTP 200; es el comportamiento documentado de Next.js con streaming.

## Iteración 5 — Favoritos y Acerca

**Objetivo:** Persistir favoritos en el navegador y documentar el proyecto y su flujo de Vibe Coding.

**Prompt utilizado:**

```text
Tarea: favoritos y página acerca.
1. src/hooks/useFavoritos.ts: hook que guarda los ids de favoritos en localStorage usando useState y useEffect (con cuidado de hidratación: leer localStorage solo en el cliente).
2. src/components/BotonFavorito.tsx (Client Component) y colócalo en la tarjeta y en el detalle.
3. src/app/favoritos/page.tsx: Client Component que lee los ids favoritos, obtiene cada receta desde /api/recetas/[id] y las muestra con RecetaCard. Estados: cargando, vacío y error.
4. src/app/acerca/page.tsx (Server Component): descripción del proyecto, tecnologías usadas y mención del flujo de Vibe Coding con opencode.
```

**Resultado:** `useFavoritos` con persistencia en `localStorage`, sincronización entre componentes y eventos `storage`; `BotonFavorito` con variantes tarjeta y detalle; botón integrado en `RecetaCard` y en `/recetas/[id]`; `/favoritos` con estados de carga, vacío, error y reintento; `/acerca` con descripción, tecnologías, flujo de Vibe Coding y explicación del flujo de datos.

**Correcciones / decisiones técnicas:**

- La lectura inicial de `localStorage` se difiere con `setTimeout(..., 0)` porque el lint de React 19 rechaza `setState` síncrono dentro de un efecto y la lectura directa rompería la hidratación.
- Los favoritos se sincronizan entre componentes con un evento propio (`recetario:favoritos:cambio`) además del evento nativo `storage`.
- `/favoritos` deriva el estado de carga y error comparando una clave de favoritos, evitando `setState` síncrono dentro del efecto.
- `GrillaRecetas` se extrajo para compartir la misma cuadrícula responsive entre `/recetas` y `/favoritos`.

## Desafíos y cómo se resolvieron

- **`.env.example` estaba siendo ignorado:** `.gitignore` usa el patrón `.env*`, que también excluye `.env.example`. Se documentó la necesidad de agregar una excepción `!.env.example` (o usar `git add -f`) para que la plantilla sí se versione.
- **Conflicto aparente entre Server Components y `error.tsx`:** la regla general indica usar `"use client"` solo para interactividad, pero los boundaries de error de Next.js exigen un Client Component. Se resolvió dejando la excepción escrita en `AGENTS.md`.
- **Next.js 16 reescribe `AGENTS.md`:** el bloque de reglas para agentes se regenera con `next dev`. En lugar de eliminarlo o duplicarlo, se preservó y se añadió el contenido propio debajo.
- **Sin runner de tests ni script de typecheck:** el proyecto solo trae `dev`, `build` y `lint`. Se documentó el comando `npx next typegen && npx tsc --noEmit` para verificar tipos y se aclaró que no hay pruebas automatizadas configuradas.
- **Bloqueo de PowerShell sobre `npm.ps1`/`npx.ps1`:** en este entorno de Windows los shims de PowerShell pueden estar bloqueados por la política de ejecución. Se documentó el uso de `npm.cmd`, `npx.cmd` o `cmd /c "npm ..."` como alternativa.
