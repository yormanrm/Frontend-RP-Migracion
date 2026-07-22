import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerProfileResponse } from '../models/profile.models';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-customer-profile',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Mi perfil" styleClass="mx-auto max-w-md">
      @if (successMessage()) {
        <p class="mb-4 text-sm text-green-600">{{ successMessage() }}</p>
      }
      @if (errorMessage()) {
        <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
      }
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
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
        <p-button type="submit" label="Guardar" [disabled]="form.invalid" styleClass="w-full" />
      </form>
    </p-card>
  `,
})
export class CustomerProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
  });

  ngOnInit() {
    this.profileService.getMe().subscribe((data) => {
      const profile = data as CustomerProfileResponse;
      this.form.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? '',
      });
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.profileService.updateCustomer(this.form.getRawValue()).subscribe({
      next: () => this.successMessage.set('Perfil actualizado'),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al actualizar perfil'),
    });
  }
}
