import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center gap-4 py-16 text-center">
      <h2 class="text-2xl font-semibold text-slate-800">404 - Página no encontrada</h2>
      <a routerLink="/" pButton label="Volver al inicio"></a>
    </div>
  `,
})
export class NotFoundComponent {}
