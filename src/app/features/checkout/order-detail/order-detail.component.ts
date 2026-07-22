import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import {
  AGGREGATE_STATUS_LABELS,
  ORDER_STATUS_LABELS,
  OrderResponse,
} from '../models/order.models';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-detail',
  imports: [DatePipe, CardModule, TableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order(); as order) {
      <div class="mx-auto flex max-w-2xl flex-col gap-4">
        <p-card header="Orden {{ order.id }}">
          <p class="mb-1 text-slate-600">
            Estado: {{ aggregateLabels[order.aggregateStatus] }}
          </p>
          <p class="mb-1 text-sm text-slate-500">{{ order.createdAt | date: 'medium' }}</p>
          @if (order.shippingAddress; as address) {
            <p class="mb-1 text-sm text-slate-500">
              Envío a: {{ address.street }}, {{ address.city }}, {{ address.state }}
              {{ address.postalCode }}, {{ address.country }}
            </p>
          }
          <p class="text-lg font-semibold text-slate-800">Total: {{ order.total }}</p>
        </p-card>

        @for (subOrder of order.subOrders; track subOrder.id) {
          <p-card header="{{ subOrder.storeName }}">
            <p class="mb-4 text-sm text-slate-600">
              Estado: {{ statusLabels[subOrder.status] }}
            </p>
            <p-table [value]="subOrder.items" styleClass="mb-4">
              <ng-template #header>
                <tr>
                  <th>Artículo</th>
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
            <p class="font-semibold text-slate-800">Subtotal tienda: {{ subOrder.total }}</p>
          </p-card>
        }
      </div>
    } @else {
      <p class="text-slate-600">Cargando...</p>
    }
  `,
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  protected readonly aggregateLabels = AGGREGATE_STATUS_LABELS;
  protected readonly statusLabels = ORDER_STATUS_LABELS;

  order = signal<OrderResponse | null>(null);

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId')!;
    this.orderService.getOrderById(orderId).subscribe((data) => this.order.set(data));
  }
}
