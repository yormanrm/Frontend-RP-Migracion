import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BrandResponse } from '../../storefront/models/catalog.models';
import { BrandService } from '../../storefront/services/brand.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-brands',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="mb-4 text-sm text-slate-500">
      Las marcas se crean automáticamente al publicar productos; aquí solo se editan o eliminan.
    </p>

    <form (ngSubmit)="load()" class="mb-6 flex items-end gap-2">
      <label class="flex grow flex-col gap-1 text-sm font-medium text-slate-700">
        Buscar marca
        <input pInputText type="text" [formControl]="query" />
      </label>
      <p-button type="submit" label="Buscar" />
    </form>

    @if (errorMessage()) {
      <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
    }

    <ul class="flex flex-col gap-2">
      @for (brand of brands(); track brand.id) {
        <li
          class="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white px-4 py-3 text-sm shadow-sm"
        >
          @if (editingId() === brand.id) {
            <form (ngSubmit)="saveEdit(brand)" class="flex grow items-center gap-2">
              <label class="sr-only" for="edit-{{ brand.id }}">Nuevo nombre</label>
              <input
                pInputText
                id="edit-{{ brand.id }}"
                type="text"
                [formControl]="editName"
                class="grow"
              />
              <p-button type="submit" label="Guardar" size="small" [disabled]="editName.invalid" />
              <p-button
                type="button"
                label="Cancelar"
                severity="secondary"
                size="small"
                [outlined]="true"
                (onClick)="editingId.set(null)"
              />
            </form>
          } @else {
            <span class="font-medium text-slate-800">{{ brand.name }}</span>
            <span class="flex gap-2">
              <p-button
                label="Renombrar"
                severity="secondary"
                size="small"
                [outlined]="true"
                (onClick)="startEdit(brand)"
              />
              <p-button
                label="Eliminar"
                severity="danger"
                size="small"
                [outlined]="true"
                (onClick)="remove(brand)"
              />
            </span>
          }
        </li>
      } @empty {
        <li class="text-sm text-slate-500">Sin marcas.</li>
      }
    </ul>
  `,
})
export class AdminBrandsComponent implements OnInit {
  private brandService = inject(BrandService);
  private adminService = inject(AdminService);

  brands = signal<BrandResponse[]>([]);
  errorMessage = signal<string | null>(null);
  editingId = signal<string | null>(null);

  query = new FormControl('', { nonNullable: true });
  editName = new FormControl('', { nonNullable: true, validators: Validators.required });

  ngOnInit() {
    this.load();
  }

  load() {
    this.errorMessage.set(null);
    this.brandService.searchBrands(this.query.value.trim()).subscribe((data) => {
      this.brands.set(data);
    });
  }

  startEdit(brand: BrandResponse) {
    this.editingId.set(brand.id);
    this.editName.setValue(brand.name);
  }

  saveEdit(brand: BrandResponse) {
    if (this.editName.invalid) return;
    this.adminService.updateBrand(brand.id, this.editName.value.trim()).subscribe({
      next: () => {
        this.editingId.set(null);
        this.load();
      },
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al guardar'),
    });
  }

  remove(brand: BrandResponse) {
    this.adminService.deleteBrand(brand.id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al eliminar'),
    });
  }
}
