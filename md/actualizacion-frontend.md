# Actualización Frontend — Plan de trabajo por fases

Migración del frontend Angular 21 al nuevo contrato del backend documentado en `actualizacion-backend.md` (verificado contra `api-docs.json` y `postman_collection.json`). Todas las decisiones de UX/producto quedaron resueltas en `dudastecnicas.md` (ronda 1, todas confirmadas).

## Estado de partida

El frontend actual (`ebd0cad`) está construido **completo contra el contrato viejo**. Casi todo lo del backend nuevo está pendiente. La migración no es aditiva: hay renombres de campos, cambios de forma de respuesta (jerarquía de órdenes, paginación, wrappers) y pantallas nuevas.

## Contratos transversales (aplican a todas las fases)

- **`ApiResponse<T>`** — toda respuesta viene envuelta en `{ data: T }`. Los servicios ya hacen `.pipe(map(res => res.data))`; mantener ese patrón en todos los nuevos.
- **`PageResponse<T>`** — `{ content, page, size, totalElements, totalPages, last }`. Reemplaza cualquier lista plana en catálogo/órdenes/admin.
- **Problem Details (RFC 7807)** — errores con `{ type, title, status, detail, instance?, errors? }`. El `errors` (mapa campo→mensaje) llega en los 400 de validación. El `error.interceptor.ts` existente maneja el genérico; los 409 puntuales (carrito) se capturan en el componente, no en el interceptor.
- **Enums** — `Role`, `ItemType` (PRODUCT/SERVICE), `DurationUnit`, `ServiceMode`, `OrderStatus`, `AggregateOrderStatus`, `SortBy`. Centralizar como `type` union en el modelo del feature correspondiente.

## Convenciones de la migración

- Standalone components, signals, `inject()`, OnPush, control flow nativo (`@if/@for`), Reactive Forms.
- PrimeNG v21 + Tailwind v4, paleta slate/blue, consistente con pantallas existentes.
- `p-autoComplete` de PrimeNG para marca (ya disponible, sin dependencia nueva).
- Sin librería de gráficos (decisión #4).
- Lazy loading por ruta (ya es el patrón en `app.routes.ts`).

---

## Fase 0 — Modelos y enums base

**Objetivo:** dejar los tipos alineados antes de tocar servicios/componentes, para que el resto compile contra el contrato correcto.

- Actualizar/crear enums union en cada `*.models.ts`: `ItemType`, `DurationUnit`, `ServiceMode`, `OrderStatus`, `AggregateOrderStatus`, `SortBy`, `Role`.
- `catalog.models.ts`: `CategoryResponse{id,name,subcategories[]}`, nuevo `SubcategoryResponse`, nuevo `BrandResponse`, `ItemResponse`/`ItemSummaryResponse` con `type`, `subcategory`, `brand`, campos de servicio (`durationValue`, `durationUnit`, `serviceMode`, `coverageArea`) y de producto (`stock`, `sku`). `ItemSearchRequest`, `ItemCreateRequest`.
- `order.models.ts`: `OrderResponse` padre con `aggregateStatus` + `subOrders[]`, `SubOrderResponse`, `AssociateOrderResponse`, `StatusUpdateRequest`.
- `profile.models.ts`: `AssociateProfileResponse{storeSlug,rfc,storeAddress}`, `CustomerProfileResponse` (sin campos de dirección), `UserAddressResponse extends Address{id,isDefault}`, `AssociateProfileUpdateRequest{firstName,lastName,storeName}`.
- `auth.models.ts`: `RegisterAssociateRequest{rfc}` (antes `taxId`/`storeSlug`), request de registro admin.
- Nuevo `AssociateSalesReportResponse`, `AdminUserSummaryResponse` (en el feature que corresponda).

**Verificación:** `ng build` no requiere nuevos tipos `any`; los modelos matchean los `required`/patterns de `api-docs.json`.

---

## Fase 1 — Auth

**Endpoints:** `POST /auth/register/associate` (rfc), `POST /auth/register/admin`.

- Registro asociado: renombrar `taxId`→`rfc`, quitar `storeSlug`. Validación de patrón RFC `^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$`, `password` minLength 8.
- El registro admin lo consume el panel admin (Fase 9), pero el request vive acá.

**Verificación:** registro asociado envía `rfc`, rechaza formato inválido en cliente antes de pegarle al backend.

---

## Fase 2 — Perfil y Direcciones

**Endpoints:** `GET/PUT /profile/me` (según rol), `GET/POST/PUT/DELETE /profile/me/addresses`, `PUT /profile/me/addresses/{id}/default`.

- **Associate profile:** quitar RFC editable (ahora read-only), agregar `storeAddress`. Update solo manda `firstName,lastName,storeName`.
- **Customer profile:** quitar campos planos de dirección (ya no existen en `CustomerProfileResponse`).
- **Mis direcciones (pantalla/tab nueva, decisión #7):** visible para **cualquier usuario autenticado** (tab en `customer-profile` y `associate-profile`). CRUD completo + marcar predeterminada. Una dirección default siempre resaltada.

**Verificación:** un asociado ve y gestiona direcciones; marcar default refleja `isDefault` correcto en la lista.

---

## Fase 3 — Cimientos de catálogo

**Objetivo:** modelos/servicios de categoría-subcategoría-marca + componente de autocompletado de marca reutilizable.

- `CategoryService`: árbol de categorías con `subcategories[]` anidadas (el endpoint ya devuelve la forma nueva).
- Nuevo `BrandService`: `GET /brands?q=` (búsqueda con debounce).
- **Componente autocompletado de marca (decisión #6):** wrapper sobre `p-autoComplete` alimentado por `GET /brands?q=`, texto libre permitido. Reutilizable en formulario de item (Fase 5) y filtro de catálogo público (Fase 4).

**Verificación:** el autocompletado sugiere marcas existentes y acepta texto nuevo sin restringir.

---

## Fase 4 — Búsqueda de catálogo público

**Endpoints:** `POST /items/search`, `GET /items/{slug}`.

- Migrar `ItemService` de GET con query params a `POST /items/search` con `ItemSearchRequest` (`q`, `subcategoryId`, `brandId`, rango de precio, `sortBy`, paginación `PageResponse`).
- `item-list`: reconstruir filtros — búsqueda por texto, subcategoría, marca (autocompletado de Fase 3), rango de precio, orden. Paginación sobre `PageResponse`.
- `item-detail`: render condicional según `type` — producto (stock/sku/marca) vs servicio (duración/modalidad/cobertura).

**Verificación:** los filtros mapean a `ItemSearchRequest`; item-detail muestra bloques correctos por tipo.

---

## Fase 5 — Inventario del asociado

**Endpoints:** `POST /associate/items`, `PUT /associate/items/{id}`, `GET /associate/items`, toggle de estado.

- **Formulario unificado (decisión #5):** un solo reactive form con selector `type` (PRODUCT/SERVICE), campos condicionales con `@if` (stock/sku/marca vs duración/modalidad/cobertura). Rutas `/associate/items/new` y `/associate/items/:id/edit` reutilizando el mismo componente (crear/editar).
- Marca vía autocompletado (Fase 3). Validación según `ItemCreateRequest` (`price,subcategoryId,title,type` requeridos).
- Lista de inventario propio con toggle activar/desactivar.

**Verificación:** crear producto y servicio desde el mismo form; editar precarga valores; toggle refleja estado.

---

## Fase 6 — Carrito

**Endpoints:** `POST /cart/items`, resto de carrito.

- **Manejo de 409 (decisión #2):** capturar el 409 puntualmente en el botón "Agregar al carrito" (no el interceptor genérico), mostrar mensaje claro: "Tu carrito tiene productos. Vacíalo primero para agregar servicios." Sin bloqueo preventivo.

**Verificación:** agregar tipo distinto al del carrito muestra el mensaje específico, no el error genérico.

---

## Fase 7 — Órdenes del comprador y checkout

**Endpoints:** `POST /checkout` (`addressId` opcional), `GET /orders`, `GET /orders/{id}`.

- **Checkout (decisión #1):** listar direcciones guardadas (radio buttons) con la predeterminada preseleccionada + link "agregar dirección nueva". Si no hay ninguna, forzar creación antes de confirmar. `addressId` seleccionado va en el body.
- **Órdenes:** render de jerarquía padre/sub-órdenes. `order-list` muestra `aggregateStatus` del padre; `order-detail` despliega `subOrders[]` con su estado individual.

**Verificación:** checkout sin direcciones bloquea confirmación; order-detail muestra sub-órdenes agrupadas por asociado con su estado.

---

## Fase 8 — Panel de órdenes del asociado (feature nueva)

**Endpoints:** `GET /associate/orders` (filtros `status`, `from`, `to`), `PUT /associate/orders/{subOrderId}/status`.

- Lista de sub-órdenes propias con filtros de estado y rango de fechas (`from`/`to`), paginación.
- **Transiciones (decisión #3):** dos botones por fila — "Avanzar" (PAID→PROCESSING→COMPLETED, oculto en COMPLETED/CANCELLED) y "Cancelar" (visible solo en PAID/PROCESSING). Nada de dropdown con todos los estados.

**Verificación:** botones respetan transiciones válidas; ninguna acción visible puede disparar un 400 de transición inválida.

---

## Fase 9 — Reporte de ventas del asociado (feature nueva)

**Endpoints:** `GET /associate/sales-report` (`from`/`to`).

- **Sin gráficos (decisión #4):** tarjetas KPI (`p-card`) para `totalRevenue`, `completedOrdersCount`, `bestSeller`, `worstSeller`, `totalStock`. Tabla simple para `zeroSalesItems[]`. Filtro de rango de fechas. Cero dependencias nuevas.
- Nota: librería de gráficos se evaluará después (no en este alcance).

**Verificación:** KPIs y tabla se recalculan al cambiar el rango de fechas.

---

## Fase 10 — Panel de administración (feature nueva)

**Endpoints:** `POST /auth/register/admin`, `GET /admin/users` + toggle, `GET /admin/items` + toggle, CRUD `/admin/categories`, `/admin/subcategories`, `PUT/DELETE /admin/brands`.

Alcance confirmado (decisión #8):

- **Crear admin** vía `POST /auth/register/admin` **sin perder la sesión propia**.
- **Lista de usuarios** (`AdminUserSummaryResponse`, paginada) con activar/desactivar.
- **Catálogo global de items** con activar/desactivar.
- **CRUD de categorías y subcategorías.**
- **Marcas: solo editar/eliminar** (sin creación manual — se crean vía "buscar o crear" en el form de item).
- Nuevo `adminGuard`.

**Verificación:** admin crea otro admin y sigue logueado; toggles reflejan estado; CRUD categoría/subcategoría funciona; marcas sin opción de crear.

---

## Fase 11 — Routing y navbar

**Objetivo:** cablear todas las rutas nuevas con guards correctos y actualizar navegación por rol.

- Rutas nuevas: direcciones (dentro de perfil), `/associate/items/:id/edit`, `/associate/orders`, `/associate/sales-report`, rutas admin bajo `/admin/*` con `adminGuard`.
- Navbar: enlaces por rol — asociado ve "Mi inventario", "Órdenes recibidas", "Reporte de ventas"; admin ve "Panel admin"; corregir el label genérico "Nuevo producto". Quitar comentario obsoleto de Fase 8 en `app.routes.ts`.
- Guards: `authGuard`, `associateGuard` (existentes) + `adminGuard` (nuevo).

**Verificación:** cada rol ve solo sus enlaces; guards bloquean acceso directo por URL a rutas ajenas.

---

## Orden de ejecución recomendado

Fase 0 primero (desbloquea compilación). Luego el orden numérico respeta dependencias: Fase 3 (cimientos catálogo) antes de 4 y 5; direcciones (Fase 2) antes de checkout (Fase 7). Fases 8, 9, 10 son features nuevas independientes entre sí. Fase 11 al final integra todo.

Cada fase se cierra con su verificación antes de pasar a la siguiente.
