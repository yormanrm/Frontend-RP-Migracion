import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserAddressResponse } from '../../profile/models/profile.models';
import { ProfileService } from '../../profile/services/profile.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout-confirm',
  imports: [FormsModule, RouterLink, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Confirmar compra" styleClass="mx-auto max-w-md">
      @if (error()) {
        <p class="mb-4 text-sm text-red-600">{{ error() }}</p>
      }

      @if (addresses(); as addresses) {
        @if (addresses.length === 0) {
          <p class="mb-4 text-sm text-slate-600">
            Necesitas una dirección de envío para completar la compra.
          </p>
          <a routerLink="/profile" pButton label="Agregar dirección" styleClass="w-full"></a>
        } @else {
          <fieldset class="mb-4 flex flex-col gap-2">
            <legend class="mb-2 text-sm font-medium text-slate-700">Dirección de envío</legend>
            @for (address of addresses; track address.id) {
              <label
                class="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 text-sm"
              >
                <input
                  type="radio"
                  name="address"
                  [value]="address.id"
                  [(ngModel)]="selectedAddressId"
                  class="mt-1"
                />
                <span class="text-slate-700">
                  <span class="font-medium">{{ address.street }}</span>
                  @if (address.isDefault) {
                    <span
                      class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                      >Predeterminada</span
                    >
                  }
                  <br />
                  {{ address.city }}, {{ address.state }} {{ address.postalCode }},
                  {{ address.country }}
                </span>
              </label>
            }
          </fieldset>
          <p class="mb-4 text-sm">
            <a routerLink="/profile" class="text-blue-600 hover:underline"
              >Agregar dirección nueva</a
            >
          </p>
          <p-button
            label="Confirmar compra"
            styleClass="w-full"
            [disabled]="loading() || !selectedAddressId"
            (onClick)="confirm()"
          />
        }
      } @else {
        <p class="text-sm text-slate-600">Cargando direcciones...</p>
      }
    </p-card>
  `,
})
export class CheckoutConfirmComponent implements OnInit {
  private orderService = inject(OrderService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  addresses = signal<UserAddressResponse[] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedAddressId: string | null = null;

  ngOnInit() {
    this.profileService.getAddresses().subscribe((data) => {
      this.addresses.set(data);
      this.selectedAddressId = data.find((a) => a.isDefault)?.id ?? data[0]?.id ?? null;
    });
  }

  confirm() {
    if (!this.selectedAddressId) return;
    this.loading.set(true);
    this.error.set(null);
    this.orderService.checkout({ addressId: this.selectedAddressId }).subscribe({
      next: (order) => this.router.navigate(['/orders', order.id]),
      error: (err) => {
        this.error.set(err.error?.detail ?? 'No se pudo confirmar la compra.');
        this.loading.set(false);
      },
    });
  }
}
