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
          <label for="storeSlug" class="text-sm font-medium text-slate-700">Slug de la tienda</label>
          <input pInputText id="storeSlug" type="text" formControlName="storeSlug" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="taxId" class="text-sm font-medium text-slate-700">Tax ID</label>
          <input pInputText id="taxId" type="text" formControlName="taxId" />
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
    password: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    storeName: ['', Validators.required],
    storeSlug: ['', Validators.required],
    taxId: [''],
  });

  submit() {
    if (this.form.invalid) return;
    this.authService.registerAssociate(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.errorMessage.set(err.error?.message ?? 'Error al registrarse'),
    });
  }
}
