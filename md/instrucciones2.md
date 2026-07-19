Vamos a refactorizar la capa visual. Por la presente, **REVÓCALE LA REGLA DE LA SECCIÓN 2** del archivo `instrucciones-arquitectura.md` (la que prohibía el diseño). A partir de este momento, la UI y la coherencia visual SÍ importan.

Tu tarea es recorrer todos los componentes existentes y aplicar un diseño limpio, moderno y estructurado utilizando **Tailwind CSS** y **PrimeNG**. 

Aplica estrictamente las siguientes directrices de diseño:

1. **Estructura Global (Layout):**
   - El `app.component.html` debe tener un layout clásico: Un Navbar fijo arriba, un `<main>` en el centro que ocupe el resto del alto de la pantalla (`min-h-screen`), y un Footer básico.
   - El contenido principal debe estar contenido y centrado usando clases de Tailwind como `container mx-auto px-4 py-8`.

2. **Uso de Tailwind CSS:**
   - Usa un esquema de colores neutro y profesional (ej. fondos `bg-slate-50`, textos `text-slate-800`).
   - Aplica márgenes y paddings coherentes (`gap-4`, `p-6`, `mb-4`) para que los elementos respiren y no estén pegados.
   - Usa Grid o Flexbox para el catálogo de productos (`grid grid-cols-1 md:grid-cols-3 gap-6`).

3. **Integración con PrimeNG:**
   - Reemplaza las tablas HTML crudas por `<p-table>` estilizadas.
   - Reemplaza los botones estándar por `<p-button>` (usa props como `severity="primary"` o `severity="danger"` según el contexto).
   - Usa `<p-card>` para envolver los formularios de Login/Registro y los items del catálogo.
   - En los formularios, usa los inputs de PrimeNG (ej. `pInputText`) y agrúpalos correctamente con etiquetas (labels) claras.

4. **Regla de No Interferencia:**
   - ESTÁ ESTRICTAMENTE PROHIBIDO alterar la lógica de TypeScript, las peticiones HTTP, los Signals o el ruteo. Tu único trabajo es modificar los archivos `.html` y agregar los imports necesarios de PrimeNG en la sección de `imports: []` de los Standalone Components.
   - No sobrediseñes

Ejecuta esta refactorización de UI componente por componente. Hazlo de manera silenciosa usando tus herramientas de edición. NO imprimas el código fuente en tus respuestas, solo avísame cuando hayas terminado de darle coherencia a toda la aplicación.