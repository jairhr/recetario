# Pruebas manuales — Recetario

Casos probados con `npm run dev` (Turbopack, http://localhost:3000).  
Fecha: 2026-11-14.

---

## 1. Timeout en `src/lib/mealdb.ts`

| Caso | Cómo reproducirlo | Resultado esperado |
|---|---|---|
| Timeout de 8 s | Añadir `await new Promise(r => setTimeout(r, 10_000))` antes del `fetch` en `consultarTheMealDB` (solo para prueba, revertir después) | La página lanza `MealDBError: "TheMealDB no respondió en el tiempo esperado (8 s)."` y el `error.tsx` del segmento muestra el mensaje de reintentar |
| Conexión caída | Desactivar la red del SO antes de cargar `/recetas` | Muestra `error.tsx` con "No se pudo conectar con TheMealDB." |
| TheMealDB 5xx | Apuntar `MEALDB_API_URL` en `.env.local` a un servidor que devuelva 503 | `respuestaError` devuelve 502 con `{ error: "TheMealDB respondió con el estado 503." }` |

---

## 2. Validación de parámetros en Route Handlers

### `GET /api/recetas?q=…`

```bash
# 400 — falta q
curl -s "http://localhost:3000/api/recetas"
# → {"error":"El parámetro q es obligatorio."}  HTTP 400

# 400 — q demasiado largo (> 200 chars)
curl -s "http://localhost:3000/api/recetas?q=$(python3 -c "print('a'*201)")"
# → {"error":"El parámetro q no puede superar 200 caracteres."}  HTTP 400

# 200 — búsqueda normal
curl -s "http://localhost:3000/api/recetas?q=chicken" | head -c 120
# → {"recetas":[{"id":"…","nombre":"…","imagen":"…"},…]}  HTTP 200
```

### `GET /api/recetas/[id]`

```bash
# 400 — id no numérico
curl -s "http://localhost:3000/api/recetas/abc"
# → {"error":"El id de la receta debe ser un número entero positivo."}  HTTP 400

# 400 — id con script injection
curl -s "http://localhost:3000/api/recetas/%3Cscript%3E"
# → {"error":"El id de la receta debe ser un número entero positivo."}  HTTP 400

# 404 — id numérico inexistente
curl -s "http://localhost:3000/api/recetas/9999999"
# → {"error":"Receta no encontrada."}  HTTP 404

# 200 — receta real
curl -s "http://localhost:3000/api/recetas/52772"
# → {"receta":{"id":"52772","nombre":"Teriyaki Chicken Casserole",…}}  HTTP 200
```

---

## 3. Favoritos con fallos parciales (`Promise.allSettled`)

| Caso | Cómo reproducirlo | Resultado esperado |
|---|---|---|
| **1 favorito falla, otros cargan** | Con 3 favoritos guardados, apagar la red a mitad de carga para que 1 falle | Se muestran las recetas que sí cargaron + banner ámbar "N recetas no se pudieron cargar y se omitieron. Reintentar" |
| **Todos los favoritos fallan** | Cortar la red antes de cargar `/favoritos` | Se muestra `EstadoError` con "Revisa tu conexión e inténtalo de nuevo." y botón Reintentar |
| **Sin favoritos** | `delete localStorage["recetario:favoritos"]` en DevTools | Estado vacío "Aún no tienes favoritos" sin errores |
| **Reintentar funciona** | Desde el banner ámbar o `EstadoError`, pulsar Reintentar con la red restaurada | Se recarga la lista completa sin refrescar la página |
| **Contador corregido** | Con 3 favoritos donde 1 falla → solo 2 cargan | El contador muestra "2 recetas guardadas" (no 3) |

---

## 4. Regresión general

| Ruta | Verificación | Estado |
|---|---|---|
| `/` | Receta del día carga; skeleton visible durante carga | ✅ |
| `/recetas` | Búsqueda por nombre con debounce; filtro por categoría | ✅ |
| `/recetas/[id]` | Ingredientes, instrucciones, botón favorito, botón YouTube | ✅ |
| `/favoritos` | Carga desde localStorage; reintentar funciona | ✅ |
| `/acerca` | Página estática sin errores | ✅ |
| `not-found` | Visitar `/ruta-inexistente` → página 404 correcta | ✅ |
