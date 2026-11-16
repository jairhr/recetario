# Bitácora de Vibe Coding - Recetario

## Resumen

- **Herramienta:** OpenCode (app de escritorio y CLI).
- **Modelo:** DeepSeek V4.1 Flash Free (`opencode/deepseek-v4.1-flash-free`).
- **Fechas:** 14 y 15 de noviembre de 2026.
- **Temática:** Recetario, una aplicación Next.js 16 con App Router para explorar recetas de TheMealDB, consultar ingredientes e instrucciones y guardar favoritos en el navegador. El proyecto se desarrolló como actividad evaluada de Vibe Coding.
- **Flujo de trabajo:** cada iteración comenzó con un prompt que pedía un plan de 3 a 5 líneas. Después se implementó, se verificó con lint, typecheck y build, se probó en el navegador cuando aplicaba y se cerró con un commit. La bitácora se actualizó al final de cada bloque para dejar constancia del objetivo, el prompt, el resultado y las decisiones técnicas.

Los prompts se reproducen literalmente. Cuando una iteración agrupó dos tareas, se incluyen ambos prompts. Las iteraciones 2, 3 y 4 conservaban solo resúmenes en la primera versión de esta bitácora; los prompts literales se recuperaron del historial local de OpenCode y se incorporaron aquí sin reescribirlos.

## Iteración 1 — Reglas del proyecto y bitácora

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

**Prompt complementario — creación de la bitácora:**

```text
Crea en la raíz el archivo VIBE_CODING.md con esta estructura:
# Bitácora de Vibe Coding - Recetario
## Herramienta de IA utilizada (opencode + modelo)
## Iteración 1
- Objetivo
- Prompt utilizado
- Resultado
- Correcciones / decisiones técnicas
## Desafíos y cómo se resolvieron
Registra en la Iteración 1 el prompt de reglas del proyecto que acabo de usar.
```

**Resultado:** Se actualizó `AGENTS.md` con las reglas del proyecto, las rutas objetivo y el flujo de datos. Se creó `VIBE_CODING.md` con la estructura de la bitácora y se registró el prompt de reglas. No se crearon rutas, componentes, Route Handlers, tipos ni `.env.example`; la implementación quedó para la siguiente iteración. Commit: `02ea903 docs: reglas del proyecto en AGENTS.md y bitácora inicial VIBE_CODING.md`.

**Correcciones / decisiones técnicas:**

- La primera versión de `AGENTS.md` se había generado con un prompt de OpenCode para instrucciones del repositorio. Sobre esa base se añadieron las reglas del proyecto, sin duplicar el bloque administrado por Next.js.
- Se conservó el bloque `<!-- BEGIN:nextjs-agent-rules -->` al inicio de `AGENTS.md`; `next dev` lo reescribe y no debe eliminarse.
- Se añadió una excepción explícita a la regla de Server Components: `error.tsx` debe ser Client Component por requisito de Next.js.
- Se documentó que los Client Components no deben llamar a TheMealDB directamente. El flujo será: navegador → Route Handlers propios en `src/app/api/...` → TheMealDB.
- Se mantuvo la regla de tipos compartidos en `src/types/` y el uso de `unknown` con narrowing en lugar de `any`.
- Se dejó constancia de que el proyecto usa Next.js 16.4.6 con `cacheComponents` y `partialPrefetching` activos, por lo que no deben añadirse configuraciones de segmento como `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` o `runtime`.

## Iteración 2 — Capa de datos, layout y portada

**Objetivo:** Construir la capa de datos de TheMealDB y la primera pantalla de la aplicación.

**Prompt utilizado — capa de datos:**

```text
Antes de escribir código, revisa next.config, AGENTS.md y la documentación de Next.js 16 incluida en el proyecto (por ejemplo, params y searchParams son Promises en esta versión). Explica en 3-5 líneas tu plan.

Tarea: crear la capa de datos de Recetario.
1. src/types/receta.ts: tipos Receta (id, nombre, categoria, area, instrucciones, imagen, ingredientes: {ingrediente, medida}[], youtube opcional) y RecetaResumen (id, nombre, imagen).
2. src/lib/mealdb.ts: funciones buscarRecetas(q), obtenerReceta(id), listarCategorias(), recetaAleatoria(). Deben usar la URL base de la variable de entorno MEALDB_API_URL (valor por defecto https://www.themealdb.com/api/json/v1/1) y normalizar la respuesta de TheMealDB (que trae strIngredient1..20 y strMeasure1..20) a nuestros tipos.
3. Route Handlers en src/app/api:
   - GET /api/recetas?q=texto
   - GET /api/recetas/[id]
   - GET /api/categorias
   - GET /api/recetas/aleatoria
   Cada uno con manejo de errores y códigos HTTP correctos (400, 404, 502).
4. Crear .env.example con MEALDB_API_URL documentada y crear .env.local con el mismo valor.

Sin any. No crees páginas todavía.
```

**Prompt utilizado — layout y portada:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: layout global y página de inicio.
1. src/app/layout.tsx: metadata (título "Recetario", descripción, lang="es"), header con navegación (Inicio, Recetas, Favoritos, Acerca) y footer. Header responsive: en móvil debe colapsar en un menú hamburguesa (este componente sí es Client Component, con useState). Marca como activo el enlace de la ruta actual.
2. src/components/ para Navbar, Footer y RecetaCard (tarjeta con imagen, nombre y enlace a /recetas/[id]; usa next/image y configura images.remotePatterns para www.themealdb.com en next.config).
3. src/app/page.tsx (Server Component): hero con título y botón hacia /recetas, y una sección "Receta del día" que obtiene una receta aleatoria llamando a la función de src/lib, no por fetch HTTP a nuestra propia API.
4. src/app/loading.tsx y src/app/error.tsx (este último Client Component con botón "Reintentar").

Diseño con Tailwind, mobile-first, paleta cálida y coherente.
```

**Resultado:** `src/types/receta.ts`, `src/lib/mealdb.ts` (normalización, búsqueda, filtro por categoría y `recetaAleatoria()`), `src/lib/api.ts` y cuatro Route Handlers (`/api/recetas`, `/api/recetas/[id]`, `/api/recetas/aleatoria`, `/api/categorias`). Layout, Navbar, Footer, `RecetaCard` y portada con la receta del día dentro de `<Suspense>`. Commits: `5c3a566 feat: tipos, cliente TheMealDB y Route Handlers de recetas y categorías` y `0286cc5 feat: layout global, navbar responsive, home con receta aleatoria`.

**Correcciones / decisiones técnicas:**

- Las imágenes remotas se limitaron a `https://www.themealdb.com/images/**` en `images.remotePatterns`.
- La fuente de datos se normaliza en el servidor; el navegador solo recibe el tipo `Receta`/`RecetaResumen`.
- Se documentaron las variables en `.env.example` y se añadió la excepción `!.env.example` a `.gitignore`.
- La portada obtiene la receta aleatoria directamente desde `src/lib/mealdb.ts`, no mediante `fetch` a la propia API, y la envuelve en `<Suspense>` para no bloquear el shell.
- `Navbar` quedó como Client Component porque controla el menú móvil con `useState`; los enlaces dependientes de la ruta se separaron después en `EnlacesNavegacion` para aislar `usePathname()`.

## Iteración 3 — Listado con búsqueda y filtro

**Objetivo:** Implementar `/recetas` con búsqueda por nombre y filtro por categoría.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: página /recetas.
1. src/app/recetas/page.tsx (Server Component): lee searchParams (q y categoria), obtiene los datos en el servidor con las funciones de src/lib y renderiza una grilla de RecetaCard. Si no hay q, muestra recetas por defecto (por ejemplo, búsqueda "chicken").
2. src/components/BuscadorRecetas.tsx (Client Component): input de búsqueda con useState y debounce con useEffect que actualiza la URL (?q=) con useRouter. Incluye selector de categorías.
3. Estado vacío ("No encontramos recetas") y src/app/recetas/loading.tsx con skeletons, y src/app/recetas/error.tsx.
4. Grilla responsive: 1 columna en móvil, 2 en tablet, 3-4 en escritorio.
```

**Resultado:** `src/app/recetas/page.tsx` con filtro por categoría vía `filter.php`, búsqueda combinada en servidor, `BuscadorRecetas` con debounce de 400 ms y `router.replace`, y `GrillaEsqueleto` compartido para los estados de carga. Estado vacío con CTA para quitar filtros y grilla `1 → 2 (sm) → 3 (lg) → 4 (xl)`. Commit: `d1ba03b feat: listado de recetas con búsqueda y filtro por categoría`.

**Correcciones / decisiones técnicas:**

- `searchParams` debe resolverse dentro de `<Suspense>` para no bloquear el prerenderizado con Cache Components.
- Las navegaciones del buscador se guardan en estado porque las refs no pueden leerse durante el render (`react-hooks/refs`).
- El filtro de categoría por defecto es `chicken` para que la primera visita tenga contenido.
- Se añadió `filtrarPorCategoria(categoria)` a `src/lib/mealdb.ts` para normalizar la respuesta de `filter.php` a `RecetaResumen`.
- Se ajustó `sizes` de `RecetaCard` para la grilla de hasta cuatro columnas en escritorio.

## Iteración 4 — Detalle de receta

**Objetivo:** Implementar `/recetas/[id]` con ingredientes, pasos y metadata dinámica.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: página /recetas/[id].
1. Server Component que obtiene la receta por id (recuerda que params es una Promise en Next 16). Usa notFound() si no existe y crea not-found.tsx.
2. Muestra imagen, nombre, categoría, región, lista de ingredientes con medidas, instrucciones en pasos y enlace a YouTube si existe.
3. generateMetadata dinámico con el nombre de la receta.
4. loading.tsx y error.tsx para esta ruta.
5. Deja un espacio para el botón de favoritos (lo haremos en el siguiente paso), sin implementarlo todavía.
```

**Resultado:** Página de detalle completa, `not-found.tsx`, `loading.tsx` y `error.tsx` propios. `generateMetadata` devuelve título, descripción y Open Graph con la imagen de la receta. Commit: `876bf3c feat: página de detalle de receta con metadata dinámica y not-found`.

**Correcciones / decisiones técnicas:**

- El build falló porque `usePathname()` en el Navbar no puede prerenderizarse fuera de `<Suspense>` en una ruta dinámica. Los enlaces dependientes del pathname se movieron a `EnlacesNavegacion`, envuelto en `<Suspense>` con un fallback estático.
- Con `loading.tsx` el shell se transmite antes de resolver la receta, así que el 404 visual llega con HTTP 200; es el comportamiento documentado de Next.js con streaming. Las rutas desconocidas fuera de este segmento sí devuelven 404.
- `params` se resuelve con `await` antes de llamar a `obtenerReceta`, y `notFound()` se usa tanto en la página como en `generateMetadata`.
- La lista de ingredientes se genera a partir de `ingredientes: { ingrediente, medida }[]`, y las instrucciones se dividen por saltos de línea en pasos numerados.

## Iteración 5 — Favoritos y Acerca

**Objetivo:** Persistir favoritos en el navegador y documentar el proyecto y su flujo de Vibe Coding.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de codificar.

Tarea: favoritos y página acerca.
1. src/hooks/useFavoritos.ts: hook que guarda los ids de favoritos en localStorage usando useState y useEffect (con cuidado de hidratación: leer localStorage solo en el cliente).
2. src/components/BotonFavorito.tsx (Client Component) y colócalo en la tarjeta y en el detalle.
3. src/app/favoritos/page.tsx: Client Component que lee los ids favoritos, obtiene cada receta desde /api/recetas/[id] y las muestra con RecetaCard. Estados: cargando, vacío y error.
4. src/app/acerca/page.tsx (Server Component): descripción del proyecto, tecnologías usadas y mención del flujo de Vibe Coding con opencode.
```

**Resultado:** `useFavoritos` con persistencia en `localStorage`, sincronización entre componentes y eventos `storage`; `BotonFavorito` con variantes tarjeta y detalle; botón integrado en `RecetaCard` y en `/recetas/[id]`; `/favoritos` con estados de carga, vacío, error y reintento; `/acerca` con descripción, tecnologías, flujo de Vibe Coding y explicación del flujo de datos. Commit: `0214cb6 feat: favoritos con localStorage y página acerca`.

**Correcciones / decisiones técnicas:**

- La lectura inicial de `localStorage` se difiere con `setTimeout(..., 0)` porque el lint de React 19 rechaza `setState` síncrono dentro de un efecto y la lectura directa rompería la hidratación.
- Los favoritos se sincronizan entre componentes con un evento propio (`recetario:favoritos:cambio`) además del evento nativo `storage`.
- `/favoritos` deriva el estado de carga y error comparando una clave de favoritos, evitando `setState` síncrono dentro del efecto.
- `GrillaRecetas` se extrajo para compartir la misma cuadrícula responsive entre `/recetas` y `/favoritos`.
- La clave de almacenamiento es `recetario:favoritos`; no hay cuentas ni servidor de favoritos.

## Iteración 6 — Cierre y commit de la entrega

**Objetivo:** Versionar en un único commit la implementación de favoritos con `localStorage`, la página Acerca y la actualización de esta bitácora, dejando el árbol de trabajo limpio.

**Prompt utilizado:**

```text
git add . && git commit -m "feat: favoritos con localStorage y página acerca"
```

**Resultado:** Se creó el commit `0214cb6` con 11 archivos modificados o nuevos (774 inserciones y 16 eliminaciones), incluida esta bitácora. `git status` quedó limpio. En ese momento no se hizo push.

**Correcciones / decisiones técnicas:**

- El commit se hizo después de que lint, typecheck y build pasaran y de verificar el flujo de favoritos en el navegador.
- La bitácora se incluyó en el mismo commit que el código para que la entrega quede autocontenida.
- Se mantuvo un commit por iteración funcional en lugar de separar la documentación en otro commit.
- El primer intento de commit con `cmd /c` falló solo por el escapado de las comillas del mensaje; `git add .` sí se aplicó y el commit se completó después con comillas simples de PowerShell.

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

**Resultado:** Auditoría completa de los 29 archivos de `src/`. Se refactorizó `/favoritos` para dejar una página Server con un island cliente `FavoritosContenido`, se eliminó el `"use client"` redundante de `useFavoritos`, se añadió el `not-found.tsx` raíz y se confirmó que ninguna página Server hace `fetch` HTTP a las rutas `/api` propias. No se encontró `any` como tipo TypeScript. Commit: `86c8533 refactor: auditoría de Server/Client Components y limpieza de use client`.

**Correcciones / decisiones técnicas:**

- El único `fetch('/api/...')` propio existe en `FavoritosContenido`, que es un Client Component. No es una violación porque depende de IDs del `localStorage` que solo existen en el navegador; `mealdb.ts` usa `process.env` y no puede ejecutarse en el cliente.
- `"use client"` en `Navbar` es necesario por el estado del menú hamburguesa. `EnlacesNavegacion` está separado como Client Island con `<Suspense>`, reduciendo al mínimo la superficie cliente.
- `useFavoritos` es un hook importado solo por Client Components; la directiva `"use client"` en el archivo del hook era redundante y se eliminó.
- `any` solo aparecía dentro de un string literal de UI en `acerca/page.tsx`, no como tipo TypeScript.
- El shell de Windows (PowerShell) no puede leer rutas con corchetes (`[id]`) directamente en `Get-Content`; se usó la herramienta de lectura del agente para acceder a esos archivos.
- La primera versión de esta bitácora afirmaba que la auditoría no había modificado archivos. Al revisar el historial se comprobó que sí hubo refactor de `/favoritos`, `FavoritosContenido`, `useFavoritos` y `not-found.tsx`; la entrada se corrigió con el contenido real del commit.

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

**Resultado:** Auditoría responsive completa en `/`, `/recetas`, `/recetas/[id]`, `/favoritos`, `/acerca` y la ruta 404. Se confirmó que no hay desbordes horizontales en 375/768/1280, que ningún objetivo táctil baja de 44 px y que las imágenes mantienen una proporción aproximada de 4/3 sin deformarse. Se ajustaron touch targets, `sizes`, alts descriptivos, `break-words` y contrastes; además se añadió `focus-visible` a los enlaces secundarios en 11 archivos. Commits: `db219fe` (touch targets, `sizes`, alts y contraste) y `a457c22 style: mejoras responsive, accesibilidad y estados de foco` (`focus-visible` en 15 líneas de 11 archivos).

**Correcciones / decisiones técnicas:**

- Los objetivos táctiles se normalizaron con `min-h-11` (44 px) o `h-11 w-11` en logo, hamburguesa, enlaces de navegación y footer, botones de favorito, CTAs, volver y enlaces de error/not-found.
- Los botones solo con icono (hamburguesa y favorito) ya tenían `aria-label`; se les añadió `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700`.
- La función `clasesEnlace()` en `EnlacesNavegacion.tsx` genera las clases de los cuatro enlaces en desktop y móvil; añadir `focus-visible:` allí cubrió todos de una sola edición.
- El `<Link>` que envuelve `RecetaCard` completa recibió un anillo de foco con `rounded-2xl` para que respete el radio de la tarjeta.
- Los `error.tsx` de los cuatro segmentos tenían `focus-visible` en el botón "Reintentar" pero no en el enlace "Volver"; se completó el estado de foco.
- El placeholder del buscador pasó de `text-stone-400` a `placeholder:text-stone-500`, y "Sin imagen disponible" de `text-stone-500` a `text-stone-600` para mejorar contraste.
- Las imágenes usan `alt={`Fotografía de ${nombre}`}`, `sizes` adecuados según la grilla o el detalle y `object-cover` para evitar deformaciones.
- Los títulos, ingredientes y pasos usan `break-words` y `min-w-0` para evitar textos cortados o desbordes con nombres largos.
- La revisión se hizo con iframes del mismo origen a 375/768/1280 px porque el viewport del navegador no se puede redimensionar directamente. Se midieron `scrollWidth` vs `clientWidth`, alturas de objetivos táctiles, atributos de imágenes y ratios de contraste.
- Algunas imágenes aparecían con `naturalWidth: 0` en la primera medición por `loading="lazy"` y estar fuera del viewport del iframe; se volvieron a medir tras cargarlas y se confirmó que no había deformación.

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

**Resultado:** Cuatro archivos modificados y `TESTING.md` creado. Commit: `9b0aaed fix: timeout, validaciones y manejo de errores parciales`.

- `mealdb.ts`: `AbortController` con timeout de 8 s; distingue timeout de error de red con mensajes distintos; `clearTimeout` en `finally`.
- `api/recetas/route.ts`: validación de longitud máxima de `q` (200 caracteres) → HTTP 400.
- `api/recetas/[id]/route.ts`: validación con regex `/^\d{1,8}$/`; IDs no numéricos (strings, scripts) → HTTP 400.
- `FavoritosContenido.tsx`: `Promise.all` → `Promise.allSettled`; las recetas que sí cargan se muestran; banner ámbar con `role="alert"` indica cuántas fallaron y ofrece reintentar; solo si todas fallan se muestra el `EstadoError` completo; el contador refleja las recetas cargadas, no el total de favoritos.
- `TESTING.md`: comandos `curl` para los casos de validación de API y tabla con instrucciones de DevTools para los casos de favoritos parciales.

**Correcciones / decisiones técnicas:**

- Se usó `DOMException` con `name === "AbortError"` para distinguir el abort del timeout de cualquier otro error de red, ya que `AbortController.abort()` lanza ese tipo específico.
- La regex de validación de ID es `/^\d{1,8}$/`: TheMealDB usa IDs numéricos de hasta 6 dígitos, y 8 es un techo conservador para no romper si el proveedor amplía su rango.
- `Promise.allSettled` nunca rechaza; la lógica de error total se detecta con `recetasCargadas.length === 0 && idsFallidas.length > 0`.
- El aviso de fallos parciales usa `role="alert"` para que los lectores de pantalla lo anuncien automáticamente cuando aparece.
- El contador de "N recetas guardadas" muestra `totalCargadas` (recetas resueltas con éxito) en lugar de `favoritos.length` (IDs en `localStorage`), evitando mostrar un número incorrecto cuando hay fallos parciales.
- Los errores de TheMealDB se transforman en `502` mediante `respuestaError`; los errores inesperados devuelven `500`.

## Iteración 10 — Documentación final del repositorio

**Objetivo:** Completar `.env.example` y reescribir el README en español con la información real del proyecto, sin añadir funcionalidades ni datos inexistentes.

**Prompt utilizado:**

```text
Explica en 3-5 líneas tu plan antes de escribir.

Tarea: documentación final del repositorio.
1. Revisa .env.example: cada variable debe tener un comentario que explique para qué sirve, su valor por defecto y si es obligatoria.
2. Reescribe README.md en español con estas secciones:
   - Título y descripción del proyecto (Recetario, actividad de Vibe Coding con Next.js)
   - Demo: enlace al despliegue en producción: https://recetario-sooty-nine.vercel.app/
   - Tecnologías (Next.js 16, TypeScript, Tailwind CSS, TheMealDB)
   - Rutas de la aplicación (páginas y endpoints /api) en una tabla
   - Requisitos previos
   - Instalación y uso paso a paso (clonar, npm install, copiar .env.example a .env.local, npm run dev)
   - Estructura de carpetas (src/app, src/components, src/lib, src/hooks, src/types)
   - Decisiones de arquitectura (Server vs Client Components)
   - Enlace a VIBE_CODING.md
   - Autor y créditos a TheMealDB
3. No inventes datos: si algo no existe en el proyecto, no lo menciones.
```

**Resultado:** `.env.example` documenta la única variable real, `MEALDB_API_URL`, con propósito, valor por defecto y obligatoriedad (`No`). `README.md` se reescribió en español con descripción, demo, tecnologías, tablas de páginas y endpoints, requisitos, instalación paso a paso, scripts, estructura de carpetas, decisiones de arquitectura, flujo de datos, favoritos, imágenes, enlace a esta bitácora, autor y créditos. Se verificó que el despliegue de producción responde, que el remoto real es `https://github.com/jairhr/recetario.git` y que Node.js debe ser 20.9 o superior según `node_modules/next/package.json`. Commit: `bba7b58 docs: README completo y .env.example documentado`.

**Correcciones / decisiones técnicas:**

- `.env.example` quedó con un comentario explícito para `MEALDB_API_URL`: para qué sirve, valor por defecto y si es obligatoria.
- El README no inventa rutas ni scripts: las páginas y endpoints se verificaron contra `src/app`, y los comandos contra `package.json`.
- Se documentó el flujo de datos: páginas Server → `src/lib/mealdb.ts` → TheMealDB; Client Components → Route Handlers propios.
- Se documentó que los favoritos viven en `localStorage` bajo `recetario:favoritos`, sin cuentas ni base de datos.
- Se incluyó la diferencia entre `npm run start` (sirve una compilación) y `npm run dev` (servidor de desarrollo con Turbopack), y el comando de typecheck `npx next typegen && npx tsc --noEmit`.
- Se documentó la instalación en Windows con `Copy-Item` y en macOS/Linux con `cp`.

---

## Desafíos y cómo se resolvieron

### Entorno y flujo de trabajo

- **Conflicto entre OpenCode CLI y la app de escritorio:** el trabajo se repartió entre la app de escritorio y la CLI de OpenCode, y no siempre mostraban el mismo estado de sesión o directorio. Se resolvió usando una sola instancia para continuar la sesión, fijando el directorio `C:\Users\Zarek\Documents\GitHub\recetario` y comprobando `git status` antes de retomar.
- **Repositorio no encontrado en GitHub:** el remoto no aparecía al consultarlo al inicio. Se verificó con `git remote -v` que la URL correcta era `https://github.com/jairhr/recetario.git`, se confirmó el owner y se completó el push de `main`; `origin/main` quedó en `bba7b58`.
- **`.env.example` estaba siendo ignorado:** `.gitignore` usa el patrón `.env*`, que también excluye `.env.example`. Se añadió la excepción `!.env.example` para que la plantilla sí se versione.
- **Bloqueo de PowerShell sobre `npm.ps1`/`npx.ps1`:** en este entorno de Windows los shims de PowerShell estaban bloqueados por la política de ejecución. Se usó `cmd /c "npm ..."`, `npm.cmd` o `npx.cmd` como alternativa.
- **PowerShell no puede leer rutas con corchetes:** los segmentos dinámicos como `src/app/recetas/[id]/` contienen corchetes que PowerShell interpreta como rangos de caracteres. Se resolvió usando la herramienta de lectura del agente, que no pasa por la shell, o escapando la ruta.
- **`Select-String` no acepta `-Recurse` sobre arrays de rutas con glob:** se resolvió con `Get-ChildItem -Recurse ... -Include "*.tsx","*.ts" | Select-String ...` en dos pasos.
- **Advertencias LF → CRLF al hacer `git add`:** Git avisó de que los archivos con LF se convertirían a CRLF en Windows por `core.autocrlf`. Son advertencias normales, no errores; se dejaron tal cual para no generar ruido de finales de línea.
- **Commit con `cmd /c` mal escapado:** el primer intento falló por las comillas del mensaje de commit. `git add .` sí se aplicó y el commit se completó después con comillas simples de PowerShell.
- **La bitácora original no tenía todos los prompts literales:** las iteraciones 2, 3 y 4 guardaban resúmenes. Se recuperaron los prompts exactos del historial local de OpenCode y se reemplazaron; no se inventó ninguno.
- **La Iteración 7 decía que no se habían modificado archivos:** el historial mostraba el commit `86c8533` con el refactor de `/favoritos`, `FavoritosContenido`, `useFavoritos` y `not-found.tsx`. Se corrigió la entrada para reflejar los cambios reales.

### Next.js 16, datos y renderizado

- **Conflicto aparente entre Server Components y `error.tsx`:** la regla general indica usar `"use client"` solo para interactividad, pero los boundaries de error de Next.js exigen un Client Component. Se resolvió dejando la excepción escrita en `AGENTS.md`.
- **Next.js 16 reescribe `AGENTS.md`:** el bloque de reglas para agentes se regenera con `next dev`. Se preservó el bloque administrado y se añadió el contenido propio debajo.
- **Sin runner de tests ni script de typecheck:** el proyecto solo trae `dev`, `build`, `start` y `lint`. Se documentó el comando `npx next typegen && npx tsc --noEmit` y se aclaró que no hay pruebas automatizadas configuradas; las pruebas manuales quedaron en `TESTING.md`.
- **Build fallido por `usePathname()` fuera de `<Suspense>`:** en la ruta dinámica `/recetas/[id]` el build no podía prerenderizar el Navbar. Se movieron los enlaces dependientes del pathname a `EnlacesNavegacion`, envuelto en `<Suspense>` con un fallback estático.
- **`searchParams` fuera de `<Suspense>`:** con Cache Components activado, la lectura de `searchParams` en `/recetas` bloqueaba el prerenderizado. El contenido que depende de la URL se movió dentro de `<Suspense>`.
- **Exportaciones de segmento prohibidas:** con `cacheComponents` y `partialPrefetching` no se pueden añadir `dynamic`, `revalidate`, `fetchCache`, `dynamicParams` ni `runtime`; se evitó usarlas y se documentó la restricción.
- **404 con `loading.tsx` que responde HTTP 200:** al transmitir el shell antes de resolver la receta, el 404 visual del segmento llega con 200. Es el comportamiento de streaming de Next.js; las rutas desconocidas fuera del segmento sí devuelven 404 y el `not-found.tsx` raíz funciona.
- **Imágenes remotas bloqueadas:** se configuró `images.remotePatterns` para `https://www.themealdb.com/images/**` antes de usar `next/image`.
- **Medición de imágenes en iframes:** algunas imágenes daban `naturalWidth: 0` por `loading="lazy"` y estar fuera del viewport. Se volvieron a medir después de cargarlas; no era un problema de renderizado.

### Favoritos e hidratación

- **Hidratación con `localStorage`:** leer `localStorage` durante el render inicial produce diferencias entre servidor y cliente. Se leyó solo en el cliente, después del primer render, y se usó el flag `hidratado` para mostrar un esqueleto hasta tener el estado real.
- **Lint `react-hooks/set-state-in-effect`:** React 19 rechaza `setState` síncrono dentro de un efecto. La lectura inicial se difirió con `setTimeout(..., 0)` para cumplir la regla sin romper la hidratación.
- **Lint `react-hooks/refs`:** el buscador leía `ref.current` durante el render para comparar la última navegación. Se reemplazó por estado (`ultimaNavegacion`) para respetar la regla.
- **`Promise.all` rompía favoritos ante un fallo individual:** si una de las N peticiones fallaba, toda la página mostraba error y se perdían las demás recetas. Se reemplazó por `Promise.allSettled`, que muestra las recetas cargadas, un aviso parcial con `role="alert"` y el error completo solo si todas fallan.
- **Contador incorrecto con fallos parciales:** mostraba el total de IDs guardados aunque algunas recetas no cargaran. Se cambió a `totalCargadas` para reflejar solo las recetas visibles.

### Calidad, accesibilidad y responsive

- **Faltaba `focus-visible` en enlaces secundarios:** los botones principales ya tenían anillo de foco, pero los enlaces "Volver", navegación, footer, error y not-found no. Se añadió `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700` en 11 archivos.
- **Objetivos táctiles menores de 44 px:** logo, hamburguesa, enlaces, botones de favorito y CTAs no siempre alcanzaban la altura mínima. Se normalizaron con `min-h-11` o `h-11 w-11`.
- **Contraste insuficiente en textos secundarios:** el placeholder usaba `text-stone-400` y "Sin imagen disponible" usaba `text-stone-500`. Se cambiaron a `text-stone-500` y `text-stone-600` respectivamente; las mediciones quedaron en 4.58:1 o más.
- **Textos largos y desbordes:** nombres de recetas, ingredientes y pasos podían cortarse. Se añadieron `break-words`, `min-w-0` y `line-clamp-2` según el caso.
- **Imágenes deformadas:** se mantuvo `object-cover` y relaciones de aspecto estables (`aspect-[4/3]`), con `fill` y `sizes` adecuados en tarjeta y detalle.
- **`alt` poco descriptivo:** se cambió el nombre solo por `Fotografía de ${nombre}` para que el texto alternativo describa la imagen.
- **El viewport del navegador no se puede redimensionar directamente:** la revisión responsive se hizo con iframes del mismo origen a 375/768/1280 px, midiendo `scrollWidth` vs `clientWidth`, rectángulos de elementos, alturas táctiles, atributos de imagen y ratios de contraste.

---

## Aprendizajes

- **Las reglas antes del código funcionaron.** Tener `AGENTS.md` con arquitectura, comandos y restricciones de Next.js 16 evitó decisiones contradictorias y ahorró correcciones posteriores.
- **Las iteraciones pequeñas con verificación al final funcionaron.** Alternar implementación, lint, typecheck, build y prueba en navegador permitió detectar errores de Suspense, hidratación y accesibilidad antes de que se acumularan.
- **La revisión en navegador aportó cosas que el código no mostraba.** Medir anchos reales, alturas táctiles y contraste reveló problemas de `focus-visible`, desbordes y textos largos que no aparecían en una revisión estática.
- **La bitácora es más útil cuando el prompt se guarda literal.** En las primeras iteraciones se guardaron resúmenes; recuperarlos después costó trabajo. La próxima vez guardaría cada prompt exacto desde el inicio y anotaría el commit asociado en el mismo momento.
- **Lo que haría distinto:** consultar primero la documentación de Next.js 16 incluida en el proyecto, mantener una sola instancia de OpenCode para la sesión y centralizar la verificación (`lint`, `typegen`, `tsc`, `build`) en un comando repetible para evitar diferencias entre PowerShell y `cmd`.
