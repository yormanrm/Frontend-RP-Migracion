import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AssociateSalesReportResponse } from '../models/sales-report.models';
import { AssociateOrderService } from '../services/associate-order.service';

@Component({
  selector: 'app-sales-report',
  imports: [ReactiveFormsModule, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="mb-6 text-2xl font-semibold text-slate-800">Reporte de ventas</h2>

    <form
      [formGroup]="filters"
      (ngSubmit)="load()"
      class="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm"
    >
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
      <p-button type="submit" label="Aplicar" />
    </form>

    @if (report(); as report) {
      <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <p-card header="Ingresos totales">
          <p class="text-2xl font-semibold text-slate-800">{{ report.totalRevenue }}</p>
          <p class="text-sm text-slate-500">Órdenes completadas</p>
        </p-card>
        <p-card header="Órdenes completadas">
          <p class="text-2xl font-semibold text-slate-800">{{ report.completedOrdersCount }}</p>
        </p-card>
        <p-card header="Stock activo total">
          <p class="text-2xl font-semibold text-slate-800">{{ report.totalStock }}</p>
        </p-card>
        <p-card header="Más vendido">
          @if (report.bestSeller; as best) {
            <p class="font-medium text-slate-800">{{ best.title }}</p>
            <p class="text-sm text-slate-500">{{ best.unitsSold }} unidades</p>
          } @else {
            <p class="text-sm text-slate-500">Sin ventas en el rango.</p>
          }
        </p-card>
        <p-card header="Menos vendido">
          @if (report.worstSeller; as worst) {
            <p class="font-medium text-slate-800">{{ worst.title }}</p>
            <p class="text-sm text-slate-500">{{ worst.unitsSold }} unidades</p>
          } @else {
            <p class="text-sm text-slate-500">Sin ventas en el rango.</p>
          }
        </p-card>
      </div>

      <p-card header="Publicaciones sin ventas">
        @if (report.zeroSalesItems.length === 0) {
          <p class="text-sm text-slate-500">Todas tus publicaciones registraron ventas.</p>
        } @else {
          <table class="w-full text-left text-sm">
            <thead class="border-b border-slate-200 text-slate-600">
              <tr>
                <th scope="col" class="px-4 py-2">Título</th>
              </tr>
            </thead>
            <tbody>
              @for (item of report.zeroSalesItems; track item.itemId) {
                <tr class="border-b border-slate-100 text-slate-700">
                  <td class="px-4 py-2">{{ item.title }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </p-card>
    } @else {
      <p class="text-slate-600">Cargando...</p>
    }
  `,
})
export class SalesReportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private associateOrderService = inject(AssociateOrderService);

  report = signal<AssociateSalesReportResponse | null>(null);

  filters = this.fb.nonNullable.group({
    from: [''],
    to: [''],
  });

  ngOnInit() {
    this.load();
  }

  load() {
    const { from, to } = this.filters.getRawValue();
    this.associateOrderService
      .salesReport({ from: from || undefined, to: to || undefined })
      .subscribe((data) => this.report.set(data));
  }
}
