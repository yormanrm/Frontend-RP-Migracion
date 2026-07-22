import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ItemResponse } from '../../storefront/models/catalog.models';
import { InventoryService } from '../services/inventory.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-inventory-list',
  imports: [RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-slate-800">Mi inventario</h2>
      <a routerLink="/associate/items/new" pButton label="Nueva publicación"></a>
    </div>

    @if (errorMessage()) {
      <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
    }

    <div class="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-slate-200 text-slate-600">
          <tr>
            <th scope="col" class="px-4 py-3">Título</th>
            <th scope="col" class="px-4 py-3">Tipo</th>
            <th scope="col" class="px-4 py-3">Precio</th>
            <th scope="col" class="px-4 py-3">Stock</th>
            <th scope="col" class="px-4 py-3">Estado</th>
            <th scope="col" class="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr class="border-b border-slate-100 text-slate-700">
              <td class="px-4 py-3 font-medium">{{ item.title }}</td>
              <td class="px-4 py-3">{{ item.type === 'PRODUCT' ? 'Producto' : 'Servicio' }}</td>
              <td class="px-4 py-3">{{ item.price }}</td>
              <td class="px-4 py-3">{{ item.stock ?? '—' }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium"
                  [class]="item.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'"
                >
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex flex-wrap gap-2 px-4 py-3">
                <a
                  [routerLink]="['/associate/items', item.id, 'edit']"
                  pButton
                  label="Editar"
                  severity="secondary"
                  size="small"
                  [outlined]="true"
                ></a>
                <p-button
                  [label]="item.active ? 'Desactivar' : 'Activar'"
                  [severity]="item.active ? 'danger' : 'success'"
                  size="small"
                  [outlined]="true"
                  (onClick)="toggleStatus(item)"
                />
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">
                Todavía no tienes publicaciones.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex items-center justify-center gap-4">
      <p-button
        label="Anterior"
        severity="secondary"
        [disabled]="page() === 0"
        (onClick)="goToPage(page() - 1)"
      />
      <span class="text-sm text-slate-600">Página {{ page() + 1 }} de {{ totalPages() }}</span>
      <p-button
        label="Siguiente"
        severity="secondary"
        [disabled]="isLastPage()"
        (onClick)="goToPage(page() + 1)"
      />
    </div>
  `,
})
export class InventoryListComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  items = signal<ItemResponse[]>([]);
  errorMessage = signal<string | null>(null);
  page = signal(0);
  totalPages = signal(0);
  isLastPage = signal(true);

  ngOnInit() {
    this.load();
  }

  goToPage(page: number) {
    this.page.set(page);
    this.load();
  }

  toggleStatus(item: ItemResponse) {
    this.inventoryService.setStatus(item.id, !item.active).subscribe({
      next: (updated) =>
        this.items.update((items) => items.map((i) => (i.id === updated.id ? updated : i))),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al cambiar el estado'),
    });
  }

  private load() {
    this.inventoryService.list({ page: this.page(), size: PAGE_SIZE }).subscribe((data) => {
      this.items.set(data.content);
      this.totalPages.set(data.totalPages);
      this.isLastPage.set(data.last);
    });
  }
}
