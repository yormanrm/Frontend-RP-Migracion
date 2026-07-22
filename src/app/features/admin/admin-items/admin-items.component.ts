import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ItemResponse, ItemType } from '../../storefront/models/catalog.models';
import { AdminService } from '../services/admin.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-admin-items',
  imports: [ReactiveFormsModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="filters"
      (ngSubmit)="search()"
      class="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm"
    >
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Tipo
        <select formControlName="type" class="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Todos</option>
          <option value="PRODUCT">Producto</option>
          <option value="SERVICE">Servicio</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Estado
        <select
          formControlName="active"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </label>
      <p-button type="submit" label="Filtrar" />
    </form>

    @if (errorMessage()) {
      <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
    }

    <div class="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-slate-200 text-slate-600">
          <tr>
            <th scope="col" class="px-4 py-3">Título</th>
            <th scope="col" class="px-4 py-3">Tipo</th>
            <th scope="col" class="px-4 py-3">Tienda</th>
            <th scope="col" class="px-4 py-3">Precio</th>
            <th scope="col" class="px-4 py-3">Estado</th>
            <th scope="col" class="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr class="border-b border-slate-100 text-slate-700">
              <td class="px-4 py-3 font-medium">{{ item.title }}</td>
              <td class="px-4 py-3">{{ item.type === 'PRODUCT' ? 'Producto' : 'Servicio' }}</td>
              <td class="px-4 py-3">{{ item.associateInfo.storeName }}</td>
              <td class="px-4 py-3">{{ item.price }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium"
                  [class]="item.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'"
                >
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p-button
                  [label]="item.active ? 'Desactivar' : 'Activar'"
                  [severity]="item.active ? 'danger' : 'success'"
                  size="small"
                  [outlined]="true"
                  (onClick)="toggle(item)"
                />
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">Sin publicaciones.</td>
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
export class AdminItemsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  items = signal<ItemResponse[]>([]);
  errorMessage = signal<string | null>(null);
  page = signal(0);
  totalPages = signal(0);
  isLastPage = signal(true);

  filters = this.fb.nonNullable.group({
    type: ['' as ItemType | ''],
    active: [''],
  });

  ngOnInit() {
    this.load();
  }

  search() {
    this.page.set(0);
    this.load();
  }

  goToPage(page: number) {
    this.page.set(page);
    this.load();
  }

  toggle(item: ItemResponse) {
    this.errorMessage.set(null);
    this.adminService.setItemStatus(item.id, !item.active).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al cambiar el estado'),
    });
  }

  private load() {
    const { type, active } = this.filters.getRawValue();
    this.adminService
      .listItems({
        type: type || undefined,
        active: active === '' ? undefined : active === 'true',
        page: this.page(),
        size: PAGE_SIZE,
      })
      .subscribe((data) => {
        this.items.set(data.content);
        this.totalPages.set(data.totalPages);
        this.isLastPage.set(data.last);
      });
  }
}
