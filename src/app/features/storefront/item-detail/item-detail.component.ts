import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../cart/services/cart.service';
import { ItemResponse } from '../models/catalog.models';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-item-detail',
  imports: [RouterLink, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item(); as item) {
      <p-card styleClass="mx-auto max-w-2xl">
        <ng-template #header>
          @if (item.images[0]) {
            <img [src]="item.images[0]" alt="" class="h-72 w-full rounded-t-lg object-cover" />
          }
        </ng-template>
        <h2 class="mb-2 text-2xl font-semibold text-slate-800">{{ item.title }}</h2>
        <p class="mb-4 text-slate-600">{{ item.description }}</p>
        <p class="mb-1 font-medium text-slate-800">Precio: {{ item.price }}</p>
        <p class="mb-1 text-sm text-slate-500">Categoría: {{ item.category.name }}</p>
        <p class="mb-4 text-sm text-slate-500">
          Vendido por: {{ item.associateInfo.storeName }}
        </p>

        <p-button
          label="Agregar al carrito"
          [disabled]="!authService.currentUser()"
          (onClick)="addToCart(item.id)"
        />
        @if (!authService.currentUser()) {
          <p class="mt-2 text-sm text-slate-600">
            <a routerLink="/login" class="text-blue-600 hover:underline">Inicia sesión</a> para
            poder comprar.
          </p>
        }
      </p-card>
    } @else {
      <p class="text-slate-600">Cargando...</p>
    }
  `,
})
export class ItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private itemService = inject(ItemService);
  private cartService = inject(CartService);
  protected authService = inject(AuthService);

  item = signal<ItemResponse | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.itemService.getItemBySlug(slug).subscribe((data) => this.item.set(data));
  }

  addToCart(itemId: string) {
    this.cartService.addToCart({ itemId, quantity: 1 }).subscribe();
  }
}
