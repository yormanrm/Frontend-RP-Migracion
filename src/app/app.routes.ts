import { Routes } from '@angular/router';
import { associateGuard } from './core/guards/associate.guard';
import { authGuard } from './core/guards/auth.guard';

// Fase 8 agregará navbar e integración final.
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Catálogo',
    loadComponent: () =>
      import('./features/storefront/item-list/item-list.component').then(
        (c) => c.ItemListComponent,
      ),
  },
  {
    path: 'items/:slug',
    title: 'Detalle de producto',
    loadComponent: () =>
      import('./features/storefront/item-detail/item-detail.component').then(
        (c) => c.ItemDetailComponent,
      ),
  },
  {
    path: 'cart',
    title: 'Carrito',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cart/cart-view/cart-view.component').then((c) => c.CartViewComponent),
  },
  {
    path: 'checkout',
    title: 'Checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout-confirm/checkout-confirm.component').then(
        (c) => c.CheckoutConfirmComponent,
      ),
  },
  {
    path: 'orders',
    title: 'Mis órdenes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/order-list/order-list.component').then(
        (c) => c.OrderListComponent,
      ),
  },
  {
    path: 'orders/:orderId',
    title: 'Detalle de orden',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/order-detail/order-detail.component').then(
        (c) => c.OrderDetailComponent,
      ),
  },
  {
    path: 'profile',
    title: 'Mi perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then((c) => c.ProfileComponent),
  },
  {
    path: 'associate/items/new',
    title: 'Nuevo producto',
    canActivate: [associateGuard],
    loadComponent: () =>
      import('./features/associate-dashboard/inventory-form/inventory-form.component').then(
        (c) => c.InventoryFormComponent,
      ),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./features/auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register/customer',
    title: 'Registro de cliente',
    loadComponent: () =>
      import('./features/auth/register-customer/register-customer.component').then(
        (c) => c.RegisterCustomerComponent,
      ),
  },
  {
    path: 'register/associate',
    title: 'Registro de asociado',
    loadComponent: () =>
      import('./features/auth/register-associate/register-associate.component').then(
        (c) => c.RegisterAssociateComponent,
      ),
  },
  {
    path: '**',
    title: 'No encontrado',
    loadComponent: () =>
      import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
  },
];