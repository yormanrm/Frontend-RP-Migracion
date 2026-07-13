# Frontend RP Migración - eCommerce

Aplicación de eCommerce moderna construida con **Angular 21**, utilizando las últimas prácticas de desarrollo con **Signals**, **Standalone Components** y **Change Detection OnPush**.

## 🚀 Estado del Proyecto

✅ **Setup inicial completado**
- Configuración de Angular 21 con mejores prácticas
- Integración de PrimeNG + Tailwind CSS
- Sistema de state management con Signals
- API cliente centralizado

## 💻 Tecnologías

- **Framework**: Angular 21
- **UI Components**: PrimeNG
- **Styling**: Tailwind CSS
- **State Management**: Signals + Computed
- **HTTP**: RxJS Observable + ApiService
- **Testing**: Vitest

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── core/              # Lógica central y compartida
│   │   ├── models/        # Tipos e interfaces (Category, Product)
│   │   ├── pages/         # Layouts y páginas base
│   │   ├── services/      # ApiService, ThemeService, ProductService
│   │   └── routes/        # Rutas del core
│   ├── features/          # Módulos de características
│   │   ├── view-all-products/   # Listado de productos
│   │   └── view-product/        # Detalle de producto
│   ├── app.config.ts      # Configuración global
│   ├── app.routes.ts      # Definición de rutas
│   └── app.ts             # Componente raíz
├── environments/          # Configuraciones por ambiente
└── styles.css             # Estilos globales
```

## 🎯 Características Implementadas

### ✅ Gestión de Productos
- **Listado**: Visualización de todos los productos con filtros
- **Detalle**: Página individual de cada producto
- **API Integration**: Conectado con Fake Store API

### 🏪 Carrito de Compras
- Almacenamiento persistente con localStorage
- State management con Signals
- Gestión de cantidad de productos

### 🎨 Interfaz de Usuario
- Layout responsive con Tailwind CSS
- Componentes de PrimeNG
- Tema personalizable (ThemeService)
- Navegación fluida

## 🛠️ Guías de Desarrollo

### Iniciar servidor de desarrollo

```bash
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando hagas cambios.

### Ejecutar tests

```bash
npm test
```

### Build para producción

```bash
npm run build
```

Los artefactos se guardarán en el directorio `dist/`.

## 🏗️ Arquitectura

### Patrones Aplicados

- **SOLID Principles**: Single Responsibility en servicios y componentes
- **Standalone Components**: Sin NgModules innecesarios
- **OnPush Change Detection**: Óptimo rendimiento
- **Signals**: Estado local reactivo y computed properties
- **Singleton Services**: `providedIn: 'root'` para inyección global

### Servicios Clave

**ApiService** (core/services)
- Cliente HTTP centralizado y genérico
- Gestión de headers y errores

**ProductService** (features/products)
- Lógica de negocio de productos
- Caché de datos

**CartStore** (features/cart)
- State management del carrito
- Persistencia con localStorage

## 🔗 API Backend

- **Proveedor**: Fake Store API
- **Base URL**: `https://api.escuelajs.co/api/v1`
- **Endpoints**: `/products`, `/categories`, etc.

## 📚 Documentación Adicional

Consulta los siguientes archivos para más información:
- `ESTADO.md` - Estado actual del proyecto y checklist
- `COMO_AGREGAR_FEATURES.md` - Guía para agregar nuevas características
- `INICIO.md` - Guía rápida para nuevos desarrolladores

## 📖 Recursos

- [Angular 21 Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [PrimeNG Components](https://primeng.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Signals RFC](https://angular.dev/guide/signals)
