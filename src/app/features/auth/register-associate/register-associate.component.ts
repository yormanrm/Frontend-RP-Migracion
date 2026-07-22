import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-associate',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Registro de asociado" styleClass="mx-auto max-w-md">
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium text-slate-700">Email</label>
          <input pInputText id="email" type="email" formControlName="email" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm font-medium text-slate-700">Password</label>
          <input pInputText id="password" type="password" formControlName="password" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="firstName" class="text-sm font-medium text-slate-700">Nombre</label>
          <input pInputText id="firstName" type="text" formControlName="firstName" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="lastName" class="text-sm font-medium text-slate-700">Apellido</label>
          <input pInputText id="lastName" type="text" formControlName="lastName" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="phone" class="text-sm font-medium text-slate-700">Teléfono</label>
          <input pInputText id="phone" type="text" formControlName="phone" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="storeName" class="text-sm font-medium text-slate-700">Nombre de la tienda</label>
          <input pInputText id="storeName" type="text" formControlName="storeName" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="rfc" class="text-sm font-medium text-slate-700">RFC</label>
          <input
            pInputText
            id="rfc"
            type="text"
            formControlName="rfc"
            class="uppercase"
            aria-describedby="rfc-error"
          />
          @if (form.controls.rfc.invalid && form.controls.rfc.touched) {
            <p id="rfc-error" class="text-sm text-red-600">
              RFC inválido (12 o 13 caracteres, ej. GOML850101AB1).
            </p>
          }
        </div>
        @if (errorMessage()) {
          <p class="text-sm text-red-600">{{ errorMessage() }}</p>
        }
        <p-button type="submit" label="Registrarme" [disabled]="form.invalid" styleClass="w-full" />
      </form>
    </p-card>
  `,
})
export class RegisterAssociateComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    storeName: ['', Validators.required],
    rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$/i)]],
  });

  submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.authService.registerAssociate({ ...value, rfc: value.rfc.toUpperCase() }).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al registrarse'),
    });
  }
}
