import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
      <div
        class="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3"
      >
        <a routerLink="/" class="text-lg font-bold text-slate-800 no-underline">Marketplace</a>
        @if (authService.currentUser(); as user) {
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <a routerLink="/cart" class="text-slate-600 no-underline hover:text-blue-600"
              >Carrito</a
            >
            <a routerLink="/orders" class="text-slate-600 no-underline hover:text-blue-600"
              >Mis órdenes</a
            >
            <a routerLink="/profile" class="text-slate-600 no-underline hover:text-blue-600"
              >Mi perfil</a
            >
            @if (user.role === 'ASSOCIATE') {
              <a
                routerLink="/associate/items"
                class="text-slate-600 no-underline hover:text-blue-600"
                >Mi inventario</a
              >
              <a
                routerLink="/associate/orders"
                class="text-slate-600 no-underline hover:text-blue-600"
                >Órdenes recibidas</a
              >
              <a
                routerLink="/associate/sales-report"
                class="text-slate-600 no-underline hover:text-blue-600"
                >Reporte de ventas</a
              >
            }
            @if (user.role === 'ADMIN') {
              <a routerLink="/admin" class="text-slate-600 no-underline hover:text-blue-600"
                >Panel admin</a
              >
            }
            <p-button label="Cerrar sesión" severity="secondary" size="small" (onClick)="logout()" />
          </div>
        } @else {
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <a routerLink="/login" class="text-slate-600 no-underline hover:text-blue-600">Login</a>
            <a
              routerLink="/register/customer"
              class="text-slate-600 no-underline hover:text-blue-600"
              >Registro cliente</a
            >
            <a
              routerLink="/register/associate"
              class="text-slate-600 no-underline hover:text-blue-600"
              >Registro asociado</a
            >
          </div>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
