import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AGGREGATE_STATUS_LABELS, OrderResponse } from '../models/order.models';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-list',
  imports: [DatePipe, RouterLink, TableModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="mb-6 text-2xl font-semibold text-slate-800">Mis órdenes</h2>
    @if (orders(); as orders) {
      @if (orders.length === 0) {
        <p class="text-slate-600">No tienes órdenes.</p>
      } @else {
        <p-table [value]="orders">
          <ng-template #header>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Tiendas</th>
              <th>Total</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template #body let-order>
            <tr>
              <td>{{ order.createdAt | date: 'short' }}</td>
              <td>{{ statusLabel(order) }}</td>
              <td>{{ order.subOrders.length }}</td>
              <td>{{ order.total }}</td>
              <td>
                <a [routerLink]="['/orders', order.id]" pButton label="Ver" severity="secondary"></a>
              </td>
            </tr>
          </ng-template>
        </p-table>
      }
    } @else {
      <p class="text-slate-600">Cargando...</p>
    }
  `,
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<OrderResponse[] | null>(null);

  statusLabel(order: OrderResponse) {
    return AGGREGATE_STATUS_LABELS[order.aggregateStatus];
  }

  ngOnInit() {
    this.orderService.getOrders().subscribe((data) => this.orders.set(data));
  }
}
