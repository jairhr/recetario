# Recetario

Recetario es una aplicación web para descubrir recetas de todo el mundo, consultar sus ingredientes e instrucciones paso a paso y guardar las favoritas en el navegador. Fue desarrollada como actividad evaluada de **Vibe Coding** con Next.js, usando IA como asistente durante todo el proceso.

## Demo

[Ver Recetario en producción](https://recetario-sooty-nine.vercel.app/)

## Tecnologías

- **Next.js 16** — App Router, Server Components, Cache Components y Route Handlers.
- **React 19** — Componentes de servidor por defecto y componentes de cliente solo para interacción.
- **TypeScript** — Modo estricto, sin `any`, con tipos compartidos en `src/types`.
- **Tailwind CSS 4** — Interfaz responsive mobile-first con una paleta cálida.
- **TheMealDB** — API pública de recetas, categorías e imágenes.

## Rutas de la aplicación

### Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Portada con una receta del día aleatoria y accesos principales. |
| `/recetas` | Listado de recetas con búsqueda por nombre (`?q=`) y filtro por categoría (`?categoria=`). |
| `/recetas/[id]` | Detalle de una receta: imagen, ingredientes, medidas, instrucciones y enlace a YouTube si existe. |
| `/favoritos` | Recetas guardadas en `localStorage`, con estados de carga, vacío y error. |
| `/acerca` | Información del proyecto, tecnologías y flujo de Vibe Coding. |

### Endpoints

| Endpoint | Descripción |
| --- | --- |
| `GET /api/recetas?q=...` | Busca recetas por nombre. El parámetro `q` es obligatorio y admite hasta 200 caracteres. |
| `GET /api/recetas/[id]` | Devuelve el detalle de una receta por su ID numérico. |
| `GET /api/recetas/aleatoria` | Devuelve una receta aleatoria. |
| `GET /api/categorias` | Devuelve el listado de categorías disponibles. |

Los endpoints responden en JSON. Los errores de validación usan `400`, una receta inexistente usa `404` y los fallos al consultar TheMealDB usan `502` con `{ "error": "..." }`.

## Requisitos previos

- [Node.js](https://nodejs.org/) **20.9 o superior**.
- **npm** (incluido con Node.js).
- Conexión a Internet, ya que las recetas se obtienen de TheMealDB.

## Instalación y uso

1. Clona el repositorio:

   ```bash
   git clone https://github.com/jairhr/recetario.git
   cd recetario
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea tu archivo de variables de entorno a partir de la plantilla:

   ```bash
   # macOS / Linux
   cp .env.example .env.local
   ```

   ```powershell
   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

   La variable `MEALDB_API_URL` es opcional. Si no la defines, se usa `https://www.themealdb.com/api/json/v1/1`.

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con Turbopack en `http://localhost:3000`. |
| `npm run build` | Compilación de producción. |
| `npm run start` | Sirve la compilación de producción. |
| `npm run lint` | Ejecuta ESLint. |

Para verificar los tipos puedes usar `npx next typegen && npx tsc --noEmit`. El proyecto no incluye un runner de pruebas automatizadas; las pruebas manuales están documentadas en [TESTING.md](./TESTING.md).

## Estructura de carpetas

```text
src/
├─ app/            Rutas del App Router, layouts, loading/error y Route Handlers en app/api
├─ components/     Navbar, Footer, tarjetas, grilla, buscador y botón de favoritos
├─ hooks/          useFavoritos (persistencia y sincronización en localStorage)
├─ lib/            mealdb.ts (cliente de TheMealDB) y api.ts (respuestas de error)
└─ types/          Tipos compartidos de receta, ingrediente y categoría
```

## Decisiones de arquitectura

### Server Components por defecto

Las páginas `/`, `/recetas`, `/recetas/[id]`, `/acerca` y el shell de `/favoritos` se renderizan en el servidor. Las páginas de datos obtienen la información directamente desde `src/lib/mealdb.ts`, sin hacer peticiones HTTP a la propia aplicación.

`/recetas` lee `searchParams` dentro de un `<Suspense>` porque el proyecto tiene Cache Components activado. Cada ruta con datos incluye su propio `loading.tsx` y `error.tsx`.

### Client Components solo donde hay interacción

- **`Navbar`**: controla el menú móvil.
- **`EnlacesNavegacion`**: usa `usePathname()` para marcar la ruta activa y está aislado dentro de un `<Suspense>`.
- **`BuscadorRecetas`**: aplica debounce y actualiza la URL con el router.
- **`BotonFavorito`**: alterna el estado de favorito.
- **`FavoritosContenido`**: lee `localStorage` y consulta `/api/recetas/[id]` desde el navegador.
- **`error.tsx`**: los límites de error de Next.js deben ser Client Components.

### Flujo de datos

El navegador nunca llama directamente a TheMealDB. Las páginas de servidor usan `src/lib/mealdb.ts` y los Client Components que necesitan datos bajo demanda pasan por los Route Handlers de `src/app/api`. Así la API key o la URL configurada permanecen en el servidor y las respuestas se normalizan antes de llegar a la interfaz.

### Favoritos locales

Los IDs de favoritos se guardan en `localStorage` bajo la clave `recetario:favoritos`. No hay cuentas ni base de datos. La sincronización entre componentes usa el evento propio `recetario:favoritos:cambio` y el evento nativo `storage`.

### Imágenes

Las imágenes se renderizan con `next/image`, con `alt` descriptivo, `sizes` adecuados y `object-cover` para evitar deformaciones. Los dominios remotos permitidos se configuran en `next.config.ts`.

## Documentación del proceso

El detalle de las iteraciones, los prompts utilizados, los resultados y las decisiones técnicas está en [VIBE_CODING.md](./VIBE_CODING.md).

## Autor

Desarrollado por [jairhr](https://github.com/jairhr) como actividad de Vibe Coding.

## Créditos

Datos e imágenes de recetas proporcionados por [TheMealDB](https://www.themealdb.com/).
