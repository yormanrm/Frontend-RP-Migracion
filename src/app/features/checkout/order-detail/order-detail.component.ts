import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { OrderResponse } from '../models/order.models';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-detail',
  imports: [CardModule, TableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order(); as order) {
      <p-card header="Orden {{ order.id }}" styleClass="mx-auto max-w-2xl">
        <p class="mb-4 text-slate-600">Estado: {{ order.status }}</p>
        <p-table [value]="order.items" styleClass="mb-4">
          <ng-template #header>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </ng-template>
          <ng-template #body let-item>
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.subtotal }}</td>
            </tr>
          </ng-template>
        </p-table>
        <p class="text-lg font-semibold text-slate-800">Total: {{ order.total }}</p>
      </p-card>
    } @else {
      <p class="text-slate-600">Cargando...</p>
    }
  `,
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<OrderResponse | null>(null);

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId')!;
    this.orderService.getOrderById(orderId).subscribe((data) => this.order.set(data));
  }
}
