import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { UserAddressResponse } from '../models/profile.models';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-address-list',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      @if (errorMessage()) {
        <p class="text-sm text-red-600">{{ errorMessage() }}</p>
      }

      @for (address of addresses(); track address.id) {
        <p-card>
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="text-sm text-slate-700">
              <p class="font-medium">
                {{ address.street }}
                @if (address.isDefault) {
                  <span
                    class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >Predeterminada</span
                  >
                }
              </p>
              <p class="text-slate-500">
                {{ address.city }}, {{ address.state }} {{ address.postalCode }},
                {{ address.country }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              @if (!address.isDefault) {
                <p-button
                  label="Hacer predeterminada"
                  severity="secondary"
                  size="small"
                  [outlined]="true"
                  (onClick)="setDefault(address)"
                />
              }
              <p-button
                label="Editar"
                severity="secondary"
                size="small"
                [outlined]="true"
                (onClick)="startEdit(address)"
              />
              <p-button
                label="Eliminar"
                severity="danger"
                size="small"
                [outlined]="true"
                (onClick)="remove(address)"
              />
            </div>
          </div>
        </p-card>
      } @empty {
        <p class="text-sm text-slate-500">Todavía no tienes direcciones guardadas.</p>
      }

      @if (formVisible()) {
        <p-card [header]="editingId() ? 'Editar dirección' : 'Nueva dirección'">
          <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label for="addr-street" class="text-sm font-medium text-slate-700">Calle</label>
              <input pInputText id="addr-street" type="text" formControlName="street" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="addr-city" class="text-sm font-medium text-slate-700">Ciudad</label>
              <input pInputText id="addr-city" type="text" formControlName="city" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="addr-state" class="text-sm font-medium text-slate-700"
                >Estado/Provincia</label
              >
              <input pInputText id="addr-state" type="text" formControlName="state" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="addr-postalCode" class="text-sm font-medium text-slate-700"
                >Código postal</label
              >
              <input pInputText id="addr-postalCode" type="text" formControlName="postalCode" />
            </div>
            <div class="flex flex-col gap-1">
              <label for="addr-country" class="text-sm font-medium text-slate-700">País</label>
              <input pInputText id="addr-country" type="text" formControlName="country" />
            </div>
            <div class="flex gap-2">
              <p-button type="submit" label="Guardar" [disabled]="form.invalid" />
              <p-button
                type="button"
                label="Cancelar"
                severity="secondary"
                [outlined]="true"
                (onClick)="closeForm()"
              />
            </div>
          </form>
        </p-card>
      } @else {
        <p-button label="Agregar dirección" styleClass="self-start" (onClick)="startCreate()" />
      }
    </div>
  `,
})
export class AddressListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  addresses = signal<UserAddressResponse[]>([]);
  errorMessage = signal<string | null>(null);
  formVisible = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
  });

  ngOnInit() {
    this.load();
  }

  startCreate() {
    this.editingId.set(null);
    this.form.reset();
    this.formVisible.set(true);
  }

  startEdit(address: UserAddressResponse) {
    this.editingId.set(address.id);
    this.form.patchValue(address);
    this.formVisible.set(true);
  }

  closeForm() {
    this.formVisible.set(false);
    this.editingId.set(null);
  }

  submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const id = this.editingId();
    const request$ = id
      ? this.profileService.updateAddress(id, value)
      : this.profileService.createAddress(value);
    request$.subscribe({
      next: () => {
        this.closeForm();
        this.load();
      },
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al guardar la dirección'),
    });
  }

  setDefault(address: UserAddressResponse) {
    this.profileService.setDefaultAddress(address.id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al actualizar la dirección'),
    });
  }

  remove(address: UserAddressResponse) {
    this.profileService.deleteAddress(address.id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al eliminar la dirección'),
    });
  }

  private load() {
    this.errorMessage.set(null);
    this.profileService.getAddresses().subscribe((data) => this.addresses.set(data));
  }
}
