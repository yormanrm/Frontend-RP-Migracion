import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout-confirm',
  imports: [CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Confirmar compra" styleClass="mx-auto max-w-md text-center">
      @if (error()) {
        <p class="mb-4 text-sm text-red-600">{{ error() }}</p>
      }
      <p-button label="Confirmar compra" [disabled]="loading()" (onClick)="confirm()" />
    </p-card>
  `,
})
export class CheckoutConfirmComponent {
  private orderService = inject(OrderService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  confirm() {
    this.loading.set(true);
    this.orderService.checkout().subscribe({
      next: (order) => this.router.navigate(['/orders', order.id]),
      error: () => {
        this.error.set('No se pudo confirmar la compra.');
        this.loading.set(false);
      },
    });
  }
}
