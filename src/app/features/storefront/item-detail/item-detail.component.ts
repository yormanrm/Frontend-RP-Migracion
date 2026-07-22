import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../cart/services/cart.service';
import { ItemResponse } from '../models/catalog.models';
import { ItemService } from '../services/item.service';

const DURATION_LABELS = { HORAS: 'horas', DIAS: 'días', SEMANAS: 'semanas' } as const;
const MODE_LABELS = { PRESENCIAL: 'Presencial', REMOTO: 'Remoto', AMBOS: 'Presencial o remoto' } as const;

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

        @if (item.type === 'SERVICE') {
          <p class="mb-1 font-medium text-slate-800">Desde {{ item.price }}</p>
          @if (item.durationValue && item.durationUnit) {
            <p class="mb-1 text-sm text-slate-500">
              Duración estimada: {{ item.durationValue }} {{ durationLabels[item.durationUnit] }}
            </p>
          }
          @if (item.serviceMode) {
            <p class="mb-1 text-sm text-slate-500">Modalidad: {{ modeLabels[item.serviceMode] }}</p>
          }
          @if (item.coverageZone) {
            <p class="mb-1 text-sm text-slate-500">Zona de cobertura: {{ item.coverageZone }}</p>
          }
        } @else {
          <p class="mb-1 font-medium text-slate-800">Precio: {{ item.price }}</p>
          <p class="mb-1 text-sm text-slate-500">
            Stock: {{ item.stock ?? 0 }}
            @if (item.sku) {
              · SKU: {{ item.sku }}
            }
            @if (item.model) {
              · Modelo: {{ item.model }}
            }
          </p>
          @if (item.brand) {
            <p class="mb-1 text-sm text-slate-500">Marca: {{ item.brand.name }}</p>
          }
        }

        <p class="mb-1 text-sm text-slate-500">
          Categoría: {{ item.subcategory.categoryName }} · {{ item.subcategory.name }}
        </p>
        <p class="mb-4 text-sm text-slate-500">
          Vendido por: {{ item.associateInfo.storeName }}
        </p>

        <p-button
          label="Agregar al carrito"
          [disabled]="!authService.currentUser()"
          (onClick)="addToCart(item.id)"
        />
        @if (cartMessage(); as message) {
          <p class="mt-2 text-sm" [class]="cartError() ? 'text-red-600' : 'text-green-600'">
            {{ message }}
          </p>
        }
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

  protected readonly durationLabels = DURATION_LABELS;
  protected readonly modeLabels = MODE_LABELS;

  item = signal<ItemResponse | null>(null);
  cartMessage = signal<string | null>(null);
  cartError = signal(false);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.itemService.getItemBySlug(slug).subscribe((data) => this.item.set(data));
  }

  addToCart(itemId: string) {
    this.cartMessage.set(null);
    this.cartError.set(false);
    this.cartService.addToCart({ itemId, quantity: 1 }).subscribe({
      next: () => this.cartMessage.set('Agregado al carrito.'),
      error: (err) => {
        this.cartError.set(true);
        if (err.status === 409) {
          this.cartMessage.set(
            err.error?.detail ??
              'Tu carrito tiene otro tipo de artículos. Vacíalo primero para agregar este.',
          );
        } else {
          this.cartMessage.set(err.error?.detail ?? 'Error al agregar al carrito.');
        }
      },
    });
  }
}
