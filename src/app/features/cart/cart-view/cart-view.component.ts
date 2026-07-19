import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-view',
  imports: [RouterLink, TableModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="mb-6 text-2xl font-semibold text-slate-800">Carrito</h2>

    @if (cartService.cart(); as cart) {
      @if (cart.items.length === 0) {
        <p class="text-slate-600">Carrito vacío.</p>
      } @else {
        <p-table [value]="cart.items" styleClass="mb-4">
          <ng-template #header>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </ng-template>
          <ng-template #body let-line>
            <tr>
              <td>{{ line.title }}</td>
              <td>{{ line.price }}</td>
              <td>
                <input
                  pInputText
                  type="number"
                  min="1"
                  [value]="line.quantity"
                  (change)="updateQuantity(line.cartItemId, $event)"
                  class="w-20"
                />
              </td>
              <td>{{ line.subtotal }}</td>
            </tr>
          </ng-template>
        </p-table>

        <div class="flex items-center justify-between">
          <p class="text-lg font-semibold text-slate-800">Total: {{ cart.total }}</p>
          <div class="flex gap-4">
            <p-button label="Vaciar carrito" severity="danger" (onClick)="clearCart()" />
            <a routerLink="/checkout" pButton label="Ir a checkout"></a>
          </div>
        </div>
      }
    } @else {
      <p class="text-slate-600">Cargando...</p>
    }
  `,
})
export class CartViewComponent implements OnInit {
  protected cartService = inject(CartService);

  ngOnInit() {
    this.cartService.getCart().subscribe();
  }

  updateQuantity(cartItemId: string, event: Event) {
    const quantity = Number((event.target as HTMLInputElement).value);
    this.cartService.updateCartItem(cartItemId, { quantity }).subscribe();
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }
}
