import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { OrderResponse } from '../models/order.models';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, TableModule, ButtonModule],
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
              <th>Orden</th>
              <th>Estado</th>
              <th>Total</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template #body let-order>
            <tr>
              <td>{{ order.id }}</td>
              <td>{{ order.status }}</td>
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

  ngOnInit() {
    this.orderService.getOrders().subscribe((data) => this.orders.set(data));
  }
}
