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

## Iteración 6 — Cierre y commit de la entrega

**Objetivo:** Versionar en un único commit la implementación de favoritos con `localStorage`, la página Acerca y la actualización de esta bitácora, dejando el árbol de trabajo limpio.

**Prompt utilizado:**

```text
git add . && git commit -m "feat: favoritos con localStorage y página acerca"
```

**Resultado:** Se creó el commit `0214cb6` con 11 archivos modificados o nuevos (774 inserciones y 16 eliminaciones), incluida esta bitácora. `git status` quedó limpio. No se hizo push.

**Correcciones / decisiones técnicas:**

- El commit se hizo después de que lint, typecheck y build pasaran y de verificar el flujo de favoritos en el navegador.
- La bitácora se incluyó en el mismo commit que el código para que la entrega quede autocontenida.
- Se mantuvo un commit por iteración funcional en lugar de separar la documentación en otro commit.

## Iteración 7 — Auditoría de arquitectura

**Objetivo:** Auditar toda la arquitectura del proyecto sin cambiar funcionalidad: clasificar componentes Server/Client, detectar `"use client"` innecesarios, verificar que ninguna página Server llame a rutas `/api` propias, confirmar cobertura de `loading.tsx`/`error.tsx` y ausencia de `any`.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: auditar la arquitectura del proyecto sin cambiar funcionalidad.
1. Revisa todos los archivos en src/ y lista en una tabla qué componentes son Server y cuáles Client, con una justificación de una línea por cada "use client".
2. Detecta "use client" innecesarios y muévelos lo más abajo posible en el árbol (por ejemplo, que solo el botón interactivo sea Client y no toda la tarjeta o página).
3. Verifica que ninguna página Server haga fetch HTTP a nuestras propias rutas /api (deben usar src/lib directamente) y que no haya ningún `any`.
4. Verifica que cada ruta con datos (/recetas, /recetas/[id], /favoritos) tenga loading.tsx y error.tsx, y que app/not-found.tsx exista.
5. Corrige lo que encuentres y reporta los cambios hechos.
```

**Resultado:** Auditoría completa de los 29 archivos de `src/`. No se modificó ningún archivo: la arquitectura ya cumplía todas las reglas. Se generó un reporte en tabla con la clasificación Server/Client y justificación de cada `"use client"`. La única observación de mejora futura documentada fue considerar un endpoint batch para favoritos (no urgente).

**Correcciones / decisiones técnicas:**

- Se confirmó que el único `fetch('/api/...')` propio existe en `FavoritosContenido`, que es un **Client Component** — no es una violación porque depende de IDs del `localStorage` que solo existen en el browser. `mealdb.ts` usa `process.env` y no puede ejecutarse en el browser.
- Se verificó que `"use client"` en `Navbar` es necesario (`useState` para el menú hamburguesa) y que `EnlacesNavegacion` está correctamente separado como Client Island con `<Suspense>`, reduciendo al mínimo la superficie Client.
- Se constató que `any` solo aparecía dentro de un string literal de UI en `acerca/page.tsx`, no como tipo TypeScript.
- El shell de Windows (PowerShell) no puede leer rutas con corchetes (`[id]`) directamente en `Get-Content`; se usó `read_file` para acceder a esos archivos.

---

## Iteración 8 — Revisión responsive y de experiencia de usuario

**Objetivo:** Revisar la UI en anchos 375 px, 768 px y 1280 px; garantizar touch targets ≥ 44 px; añadir `focus-visible` y `aria-label` en todos los elementos interactivos; verificar contraste y uso correcto de `next/image`.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: revisión responsive y de experiencia de usuario.
1. Revisa en anchos 375px, 768px y 1280px: navbar, grilla de recetas, detalle, favoritos y formulario de búsqueda. Corrige desbordes horizontales, textos cortados e imágenes deformadas.
2. Los elementos táctiles deben medir al menos 44px de alto.
3. Añade estados focus-visible y aria-label en botones solo con icono (hamburguesa, favorito).
4. Asegura contraste de texto suficiente y que las imágenes usen next/image con alt descriptivo y sizes adecuados.
5. Mantén la paleta cálida actual y no agregues librerías nuevas.
```

**Resultado:** Auditoría responsive completa. Touch targets, `aria-label`, imágenes y contraste ya estaban correctos. Se detectó y corrigió la ausencia de `focus-visible:outline` en 11 archivos: los enlaces secundarios (volver, ver favoritos, links de nav, footer, error pages, not-found, acerca) carecían del anillo de foco naranja que sí tenían los botones principales. 15 líneas modificadas en 11 archivos; lint y typecheck limpios.

**Correcciones / decisiones técnicas:**

- La función `clasesEnlace()` en `EnlacesNavegacion.tsx` generaba las clases para los 4 links del nav tanto en desktop como en móvil; añadir `focus-visible:` ahí los cubrió todos de una sola edición.
- El `<Link>` que envuelve `RecetaCard` completa no tenía foco visible; se añadió `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 rounded-2xl` para que el anillo respete el radio de la tarjeta.
- Los error pages (`app/error.tsx`, `recetas/error.tsx`, `favoritos/error.tsx`, `recetas/[id]/error.tsx`) tenían `focus-visible` en el botón "Reintentar" pero no en el link "Volver".
- El texto `text-stone-500` solo se usa en placeholders, que están exentos del requisito de contraste WCAG; los textos de contenido usan `text-stone-600` (≈ 5.9:1 sobre blanco) o superior.

---

## Iteración 9 — Endurecimiento del manejo de errores

**Objetivo:** Añadir timeout al cliente HTTP, validar parámetros en Route Handlers, y hacer que favoritos muestre las recetas que sí cargan cuando alguna falla individualmente.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: endurecer el manejo de errores.
1. En src/lib/mealdb.ts: agrega timeout al fetch (AbortController, 8 s) y lanza errores tipados con mensaje claro cuando TheMealDB falle o devuelva una respuesta inesperada.
2. En los Route Handlers: valida parámetros (q con longitud máxima razonable, id numérico) y devuelve 400/404/502 según corresponda con un JSON { error: string }.
3. En favoritos: si una receta falla al cargar, mostrar las demás y un aviso, sin romper toda la página.
4. Agrega un script o comentario con los casos probados manualmente.
```

**Resultado:** Cuatro archivos modificados y `TESTING.md` creado.

- `mealdb.ts`: `AbortController` con timeout de 8 s; distingue timeout de error de red con mensajes distintos; `clearTimeout` en `finally`.
- `api/recetas/route.ts`: validación de longitud máxima de `q` (200 chars) → HTTP 400.
- `api/recetas/[id]/route.ts`: validación con regex `/^\d{1,8}$/`; IDs no numéricos (strings, scripts) → HTTP 400.
- `FavoritosContenido.tsx`: `Promise.all` → `Promise.allSettled`; recetas que sí cargan se muestran; banner ámbar con `role="alert"` lista cuántas fallaron y ofrece reintentar; solo si **todas** fallan se muestra el `EstadoError` completo; el contador refleja las recetas cargadas, no el total de favoritos.
- `TESTING.md`: comandos `curl` para los tres casos de validación de API y tabla con instrucciones de DevTools para los casos de favoritos parciales.

**Correcciones / decisiones técnicas:**

- Se usó `DOMException` con `name === "AbortError"` para distinguir el abort del timeout de cualquier otro error de red, ya que `AbortController.abort()` lanza ese tipo específico.
- La regex de validación de ID es `/^\d{1,8}$/` — TheMealDB usa IDs numéricos de hasta 6 dígitos; 8 es el techo conservador para no romper si el proveedor amplía su rango.
- `Promise.allSettled` nunca rechaza; el bloque `try/catch` alrededor del `cargar()` anterior se eliminó y la lógica de error total se detecta con `recetasCargadas.length === 0 && idsFallidas.length > 0`.
- El aviso de fallos parciales usa `role="alert"` para que lectores de pantalla lo anuncien automáticamente cuando aparece.
- El contador de "N recetas guardadas" ahora muestra `totalCargadas` (recetas resueltas con éxito) en lugar de `favoritos.length` (IDs en localStorage), evitando mostrar un número incorrecto cuando hay fallos parciales.

---

## Desafíos y cómo se resolvieron

- **`.env.example` estaba siendo ignorado:** `.gitignore` usa el patrón `.env*`, que también excluye `.env.example`. Se documentó la necesidad de agregar una excepción `!.env.example` (o usar `git add -f`) para que la plantilla sí se versione.
- **Conflicto aparente entre Server Components y `error.tsx`:** la regla general indica usar `"use client"` solo para interactividad, pero los boundaries de error de Next.js exigen un Client Component. Se resolvió dejando la excepción escrita en `AGENTS.md`.
- **Next.js 16 reescribe `AGENTS.md`:** el bloque de reglas para agentes se regenera con `next dev`. En lugar de eliminarlo o duplicarlo, se preservó y se añadió el contenido propio debajo.
- **Sin runner de tests ni script de typecheck:** el proyecto solo trae `dev`, `build` y `lint`. Se documentó el comando `npx next typegen && npx tsc --noEmit` para verificar tipos y se aclaró que no hay pruebas automatizadas configuradas.
- **Bloqueo de PowerShell sobre `npm.ps1`/`npx.ps1`:** en este entorno de Windows los shims de PowerShell pueden estar bloqueados por la política de ejecución. Se documentó el uso de `npm.cmd`, `npx.cmd` o `cmd /c "npm ..."` como alternativa.
- **Advertencias LF → CRLF al hacer `git add`:** Git avisó de que los archivos con LF se convertirían a CRLF la próxima vez que los tocara. Son advertencias normales en Windows por `core.autocrlf`, no errores; no alteran el contenido y se dejaron tal cual para no generar ruido de finales de línea.
- **PowerShell no puede leer rutas con corchetes en `Get-Content`:** los segmentos dinámicos de Next.js como `src/app/recetas/[id]/` contienen corchetes que PowerShell interpreta como rangos de caracteres. Se resolvió usando la herramienta `read_file` del agente, que no pasa por la shell, o bien encerrando la ruta en comillas con escape `\[id\]` en comandos de búsqueda.
- **`Select-String` no acepta `-Recurse` sobre arrays de rutas con glob:** en PowerShell, `Select-String` con múltiples patrones en `-Path` y `-Recurse` lanza un error de parámetro. Se resolvió con `Get-ChildItem -Recurse ... -Include "*.tsx","*.ts" | Select-String ...` para hacer la búsqueda en dos pasos.
- **`Promise.all` rompía la página de favoritos ante un fallo individual:** si cualquiera de las N peticiones paralelas fallaba, toda la página mostraba error y las demás recetas se perdían. Se reemplazó por `Promise.allSettled` con lógica explícita para separar recetas resueltas de fallidas, mostrando un aviso inline en lugar de bloquear toda la vista.
