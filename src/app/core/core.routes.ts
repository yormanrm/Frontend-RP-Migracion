import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
      },
      {
        path: 'all',
        title: 'All Products',
        loadComponent: () =>
          import('../features/view-all-products/view-all-products.component').then(
            (c) => c.viewAllProductsComponent,
          ),
      },
      {
        path: 'product',
        title: 'View Product',
        loadComponent: () =>
          import('../features/view-product/view-product.component').then(
            (c) => c.ViewProductComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    title: 'Not Found',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];