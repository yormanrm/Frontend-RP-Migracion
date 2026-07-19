import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AssociateProfileResponse } from '../models/profile.models';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-associate-profile',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Mi perfil de asociado" styleClass="mx-auto max-w-md">
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
        <div class="flex flex-col gap-1">
          <label for="storeName" class="text-sm font-medium text-slate-700">Nombre de tienda</label>
          <input pInputText id="storeName" type="text" formControlName="storeName" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="taxId" class="text-sm font-medium text-slate-700">RFC/Tax ID</label>
          <input pInputText id="taxId" type="text" formControlName="taxId" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="publicBio" class="text-sm font-medium text-slate-700">Biografía pública</label>
          <textarea
            id="publicBio"
            formControlName="publicBio"
            rows="4"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm"
          ></textarea>
        </div>
        <div class="flex flex-col gap-1">
          <label for="publicContactEmail" class="text-sm font-medium text-slate-700"
            >Email de contacto público</label
          >
          <input pInputText id="publicContactEmail" type="email" formControlName="publicContactEmail" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="publicContactPhone" class="text-sm font-medium text-slate-700"
            >Teléfono de contacto público</label
          >
          <input pInputText id="publicContactPhone" type="text" formControlName="publicContactPhone" />
        </div>
        <p-button type="submit" label="Guardar" [disabled]="form.invalid" styleClass="w-full" />
      </form>
    </p-card>
  `,
})
export class AssociateProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    storeName: ['', Validators.required],
    taxId: [''],
    publicBio: [''],
    publicContactEmail: [''],
    publicContactPhone: [''],
  });

  ngOnInit() {
    this.profileService.getMe().subscribe((data) => {
      const profile = data as AssociateProfileResponse;
      this.form.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? '',
        storeName: profile.storeName,
        taxId: profile.taxId ?? '',
        publicBio: profile.publicBio ?? '',
        publicContactEmail: profile.publicContactEmail ?? '',
        publicContactPhone: profile.publicContactPhone ?? '',
      });
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.profileService.updateAssociate(this.form.getRawValue()).subscribe({
      next: () => this.successMessage.set('Perfil actualizado'),
      error: (err) => this.errorMessage.set(err.error?.message ?? 'Error al actualizar perfil'),
    });
  }
}
