import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  AssociateOrderResponse,
  ORDER_STATUS_LABELS,
  OrderStatus,
} from '../../checkout/models/order.models';
import { AssociateOrderService } from '../services/associate-order.service';

const PAGE_SIZE = 20;
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PAID: 'PROCESSING',
  PROCESSING: 'COMPLETED',
};

@Component({
  selector: 'app-associate-orders',
  imports: [DatePipe, ReactiveFormsModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="mb-6 text-2xl font-semibold text-slate-800">Órdenes recibidas</h2>

    <form
      [formGroup]="filters"
      (ngSubmit)="search()"
      class="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm"
    >
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Estado
        <select
          formControlName="status"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="PAID">Pagada</option>
          <option value="PROCESSING">En preparación</option>
          <option value="COMPLETED">Completada</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Desde
        <input
          type="date"
          formControlName="from"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Hasta
        <input
          type="date"
          formControlName="to"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
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
            <th scope="col" class="px-4 py-3">Fecha</th>
            <th scope="col" class="px-4 py-3">Cliente</th>
            <th scope="col" class="px-4 py-3">Artículos</th>
            <th scope="col" class="px-4 py-3">Total</th>
            <th scope="col" class="px-4 py-3">Estado</th>
            <th scope="col" class="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (order of orders(); track order.id) {
            <tr class="border-b border-slate-100 text-slate-700">
              <td class="px-4 py-3">{{ order.createdAt | date: 'short' }}</td>
              <td class="px-4 py-3">
                {{ order.customer.firstName }} {{ order.customer.lastName }}
              </td>
              <td class="px-4 py-3">{{ order.items.length }}</td>
              <td class="px-4 py-3">{{ order.total }}</td>
              <td class="px-4 py-3">{{ statusLabels[order.status] }}</td>
              <td class="flex flex-wrap gap-2 px-4 py-3">
                @if (nextStatus[order.status]; as next) {
                  <p-button
                    [label]="next === 'PROCESSING' ? 'Preparar' : 'Completar'"
                    size="small"
                    (onClick)="updateStatus(order, next)"
                  />
                  <p-button
                    label="Cancelar"
                    severity="danger"
                    size="small"
                    [outlined]="true"
                    (onClick)="updateStatus(order, 'CANCELLED')"
                  />
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">Sin órdenes.</td>
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
export class AssociateOrdersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private associateOrderService = inject(AssociateOrderService);

  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly nextStatus = NEXT_STATUS;

  orders = signal<AssociateOrderResponse[]>([]);
  errorMessage = signal<string | null>(null);
  page = signal(0);
  totalPages = signal(0);
  isLastPage = signal(true);

  filters = this.fb.nonNullable.group({
    status: ['' as OrderStatus | ''],
    from: [''],
    to: [''],
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

  updateStatus(order: AssociateOrderResponse, status: OrderStatus) {
    this.errorMessage.set(null);
    this.associateOrderService.updateStatus(order.id, status).subscribe({
      next: (updated) =>
        this.orders.update((orders) => orders.map((o) => (o.id === updated.id ? updated : o))),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al actualizar el estado'),
    });
  }

  private load() {
    const { status, from, to } = this.filters.getRawValue();
    this.associateOrderService
      .list({
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        page: this.page(),
        size: PAGE_SIZE,
      })
      .subscribe((data) => {
        this.orders.set(data.content);
        this.totalPages.set(data.totalPages);
        this.isLastPage.set(data.last);
      });
  }
}
