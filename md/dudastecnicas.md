# Dudas técnicas — ronda 1

Contexto: auditoría completa confirma que el frontend actual (`ebd0cad`) está construido contra el contrato VIEJO del backend. Prácticamente todo lo listado en `actualizacion-backend.md` está pendiente: auth (rfc/taxId), perfiles, direcciones (no existe la pantalla), catálogo (categoría/subcategoría/marca), formulario de item (producto/servicio unificado), búsqueda (POST /items/search), órdenes (jerarquía padre/sub-órdenes), panel de asociado (órdenes propias, reporte de ventas), carrito (409), y admin (confirmado ya que se construye completo). Antes de escribir `actualizacion-frontend.md` necesito resolver los siguientes puntos de diseño/producto — no son dudas técnicas de "cómo" sino de "qué UX querés", porque adivinar mal implica rehacer pantallas completas.

Responde inline debajo de cada pregunta (o con un simple A/B). Si alguna no aplica o no te importa, dejalo con "lo que prefieras" y tomo la opción recomendada.

---

## 1. Checkout — selección de dirección de envío

`POST /checkout` acepta `addressId` opcional; si no se envía, el backend usa la dirección predeterminada. Hoy no existe pantalla de checkout con selección de dirección (solo un botón "confirmar").

**Opción A (recomendada):** en checkout, listar las direcciones guardadas del usuario (radio buttons) con la predeterminada preseleccionada, más un link "agregar dirección nueva" que lleva a la pantalla de direcciones. Si no tiene ninguna dirección, forzar a crear una antes de poder confirmar.
**Opción B:** checkout minimalista, siempre usa la dirección predeterminada sin selector; la única forma de cambiarla es yendo antes a Perfil → Direcciones y marcando otra como predeterminada.

¿A o B?

**Respuesta:** 
    Opcion A
---

## 2. Carrito — mezcla de producto y servicio (409)

El backend rechaza con 409 si el carrito ya tiene un tipo (PRODUCT/SERVICE) y se intenta agregar el otro.

**Opción A (recomendada):** manejo reactivo simple — dejar que el usuario intente agregar, capturar el 409 puntualmente en el botón "Agregar al carrito" (no el interceptor genérico) y mostrar un mensaje claro tipo "Tu carrito tiene productos. Vacíalo primero para agregar servicios." Sin lógica adicional de bloqueo preventivo.
**Opción B:** bloqueo proactivo — antes de mostrar el botón "Agregar al carrito" en cada item, consultar el tipo del carrito actual y deshabilitar/ocultar el botón si no coincide.

¿A o B? (A es menos código y cubre el caso igual de bien porque el error ya es claro)

**Respuesta:** 
    Opcion A
--- 

## 3. Panel asociado — transición de estado de sub-orden

Transiciones válidas: `PAID→PROCESSING`, `PROCESSING→COMPLETED`, y `CANCELLED` desde `PAID` o `PROCESSING`. Cualquier otra combinación es 400.

**Opción A (recomendada):** dos botones por fila: "Avanzar" (PAID→PROCESSING→COMPLETED, se oculta en COMPLETED/CANCELLED) y "Cancelar" (visible solo en PAID/PROCESSING). Nada de dropdown con todos los estados — evita que el usuario intente una transición inválida y se lleve un 400.
**Opción B:** un `<select>` con todos los estados y que el 400 se maneje con el mensaje de error genérico si elige mal.

¿A o B?

**Respuesta:**
 Opcion A
---

## 4. Reporte de ventas — visualización

`AssociateSalesReportResponse` trae: `totalRevenue`, `completedOrdersCount`, `bestSeller`, `worstSeller`, `totalStock`, `zeroSalesItems[]`. No hay librería de gráficos instalada (no chart.js, no ngx-charts) — agregarla es una dependencia nueva.

**Opción A (recomendada):** sin gráficos. Tarjetas KPI (p-card) para los números + una tabla simple para `zeroSalesItems`, con filtro de rango de fechas (`from`/`to`). Cero dependencias nuevas.
**Opción B:** agregar una librería de gráficos (ej. Chart.js vía `ng2-charts`) para un gráfico de barras o similar.

¿A o B?

**Respuesta:**
 Opcion A de momento, despues investigare que libreria implementar para graficos mas completos
---

## 5. Formulario de item — producto vs servicio, ¿un formulario o dos?

**Opción A (recomendada):** un solo formulario reactivo con selector `type` (PRODUCT/SERVICE) que muestra/oculta campos condicionalmente con `@if` (stock/sku/marca vs duración/modalidad/cobertura). Una sola ruta `/associate/items/new` y `/associate/items/:id/edit`, reutilizando el mismo componente para crear y editar.
**Opción B:** dos formularios/rutas separadas ("Nuevo producto" / "Nuevo servicio").

¿A o B?

**Respuesta:**
    Opcion A
---

## 6. Marca (brandName) — autocompletado

El backend hace "buscar o crear" de marca por nombre libre (case-insensitive). PrimeNG trae `AutoComplete` (ya está en `primeng`, no requiere instalar nada nuevo).

**Propuesta (no debería requerir decisión, la doy por buena a menos que digas lo contrario):** usar `p-autoComplete` en el formulario de item, alimentado por `GET /brands?q=` con debounce, permitiendo texto libre (no restringido a las sugerencias). Igual criterio para el filtro de marca en el catálogo público.

¿Ok o preferís un `<input>` simple de texto sin autocompletado (más simple, menos UX)?

**Respuesta:**
    Tu propuesta es la correcta
---

## 7. Direcciones — ¿disponibles también para el rol ASOCIADO?

El endpoint `/profile/me/addresses` es 🔑 (cualquier rol autenticado), no exclusivo de CUSTOMER. Un asociado también podría comprar en el marketplace (nada en el backend se lo impide) y necesitaría direcciones propias para hacer checkout.

**Opción A (recomendada):** la pantalla/sección "Mis direcciones" se muestra para cualquier usuario autenticado (tab en Perfil, visible tanto en `customer-profile` como en `associate-profile`), ya que el checkout la necesita sin importar el rol.
**Opción B:** direcciones solo visibles/accesibles para CUSTOMER; un asociado no tiene acceso a esa pantalla desde su perfil.

¿A o B?

**Respuesta:**
    Opcion A
---

## 8. Admin — confirmación de alcance (ya charlado, solo lo dejo escrito para que quede registrado en el plan)

Ya definiste: admin completo — un admin puede crear otros admins (`POST /auth/register/admin` sin perder la sesión propia), lista de usuarios con activar/desactivar, catálogo global de items con activar/desactivar, y CRUD de categorías/subcategorías/marcas (marcas solo editar/eliminar, sin crear manual). Lo incluyo como fase del plan tal cual. Si cambió algo, avisame acá.

**Respuesta:**
    Todo bien, de momento no es necesario ajustar nada mas en el panel de admin
---

Cuando respondas estas, si de las respuestas surgen dudas nuevas las agrego en `dudastecnicas.md` (ronda 2) antes de escribir `actualizacion-frontend.md`.
