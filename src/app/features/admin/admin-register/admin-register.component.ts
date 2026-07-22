import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-register',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Crear administrador" styleClass="mx-auto max-w-md">
      @if (successMessage()) {
        <p class="mb-4 text-sm text-green-600">{{ successMessage() }}</p>
      }
      @if (errorMessage()) {
        <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
      }
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="admin-email" class="text-sm font-medium text-slate-700">Email</label>
          <input pInputText id="admin-email" type="email" formControlName="email" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="admin-password" class="text-sm font-medium text-slate-700">Password</label>
          <input pInputText id="admin-password" type="password" formControlName="password" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="admin-firstName" class="text-sm font-medium text-slate-700">Nombre</label>
          <input pInputText id="admin-firstName" type="text" formControlName="firstName" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="admin-lastName" class="text-sm font-medium text-slate-700">Apellido</label>
          <input pInputText id="admin-lastName" type="text" formControlName="lastName" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="admin-phone" class="text-sm font-medium text-slate-700">Teléfono</label>
          <input pInputText id="admin-phone" type="text" formControlName="phone" />
        </div>
        <p-button type="submit" label="Crear admin" [disabled]="form.invalid" styleClass="w-full" />
      </form>
    </p-card>
  `,
})
export class AdminRegisterComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
  });

  submit() {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.adminService.registerAdmin(this.form.getRawValue()).subscribe({
      next: () => {
        this.successMessage.set('Administrador creado. Tu sesión sigue activa.');
        this.form.reset();
      },
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al crear el administrador'),
    });
  }
}
