import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { BrandAutocompleteComponent } from '../../../shared/components/brand-autocomplete/brand-autocomplete.component';
import {
  BrandResponse,
  CategoryResponse,
  DurationUnit,
  ItemResponse,
  ItemType,
  ServiceMode,
} from '../../storefront/models/catalog.models';
import { CategoryService } from '../../storefront/services/category.service';
import { ItemCreateRequest } from '../models/inventory.models';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-inventory-form',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, BrandAutocompleteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card [header]="editingId() ? 'Editar publicación' : 'Nueva publicación'" styleClass="mx-auto max-w-md">
      @if (errorMessage()) {
        <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
      }
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="type" class="text-sm font-medium text-slate-700">Tipo</label>
          <select
            id="type"
            formControlName="type"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="PRODUCT">Producto</option>
            <option value="SERVICE">Servicio</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="title" class="text-sm font-medium text-slate-700">Título</label>
          <input pInputText id="title" type="text" formControlName="title" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="description" class="text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm"
          ></textarea>
        </div>
        <div class="flex flex-col gap-1">
          <label for="price" class="text-sm font-medium text-slate-700">
            {{ form.controls.type.value === 'SERVICE' ? 'Precio (Desde $)' : 'Precio' }}
          </label>
          <input pInputText id="price" type="number" formControlName="price" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="subcategoryId" class="text-sm font-medium text-slate-700">Subcategoría</label>
          <select
            id="subcategoryId"
            formControlName="subcategoryId"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Selecciona</option>
            @for (category of categories(); track category.id) {
              <optgroup [label]="category.name">
                @for (sub of category.subcategories; track sub.id) {
                  <option [value]="sub.id">{{ sub.name }}</option>
                }
              </optgroup>
            }
          </select>
        </div>

        @if (form.controls.type.value === 'PRODUCT') {
          <div class="flex flex-col gap-1">
            <label for="stock" class="text-sm font-medium text-slate-700">Stock</label>
            <input pInputText id="stock" type="number" formControlName="stock" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="sku" class="text-sm font-medium text-slate-700">SKU</label>
            <input pInputText id="sku" type="text" formControlName="sku" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="model" class="text-sm font-medium text-slate-700">Modelo</label>
            <input pInputText id="model" type="text" formControlName="model" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="brand" class="text-sm font-medium text-slate-700">Marca</label>
            <app-brand-autocomplete [(value)]="brand" inputId="brand" />
          </div>
        } @else {
          <div class="flex flex-col gap-1">
            <label for="brand" class="text-sm font-medium text-slate-700">Marca (opcional)</label>
            <app-brand-autocomplete [(value)]="brand" inputId="brand" />
          </div>
          <div class="flex gap-4">
            <div class="flex grow flex-col gap-1">
              <label for="durationValue" class="text-sm font-medium text-slate-700">Duración</label>
              <input pInputText id="durationValue" type="number" formControlName="durationValue" />
            </div>
            <div class="flex grow flex-col gap-1">
              <label for="durationUnit" class="text-sm font-medium text-slate-700">Unidad</label>
              <select
                id="durationUnit"
                formControlName="durationUnit"
                class="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">—</option>
                <option value="HORAS">Horas</option>
                <option value="DIAS">Días</option>
                <option value="SEMANAS">Semanas</option>
              </select>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="serviceMode" class="text-sm font-medium text-slate-700">Modalidad</label>
            <select
              id="serviceMode"
              formControlName="serviceMode"
              class="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="AMBOS">Ambos</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label for="coverageZone" class="text-sm font-medium text-slate-700"
              >Zona de cobertura</label
            >
            <input pInputText id="coverageZone" type="text" formControlName="coverageZone" />
          </div>
        }

        <div class="flex flex-col gap-1">
          <label for="images" class="text-sm font-medium text-slate-700"
            >Imágenes (URLs separadas por coma)</label
          >
          <input pInputText id="images" type="text" formControlName="images" />
        </div>
        <p-button type="submit" label="Guardar" [disabled]="form.invalid" styleClass="w-full" />
      </form>
    </p-card>
  `,
})
export class InventoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = signal<CategoryResponse[]>([]);
  errorMessage = signal<string | null>(null);
  editingId = signal<string | null>(null);
  brand = signal<BrandResponse | string | null>(null);

  form = this.fb.nonNullable.group({
    type: ['PRODUCT' as ItemType, Validators.required],
    title: ['', Validators.required],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    subcategoryId: ['', Validators.required],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
    sku: ['', Validators.required],
    model: [''],
    durationValue: [null as number | null],
    durationUnit: ['' as DurationUnit | ''],
    serviceMode: ['' as ServiceMode | ''],
    coverageZone: [''],
    images: [''],
  });

  constructor() {
    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((type) => this.applyTypeValidators(type));
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => this.categories.set(data));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(id);
      this.loadItem(id);
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    const raw = this.form.getRawValue();
    const brand = this.brand();
    const brandName = (typeof brand === 'string' ? brand : (brand?.name ?? '')).trim();

    if (raw.type === 'PRODUCT' && !brandName) {
      this.errorMessage.set('La marca es obligatoria para productos.');
      return;
    }

    const request: ItemCreateRequest = {
      title: raw.title,
      description: raw.description || undefined,
      type: raw.type,
      price: raw.price!,
      subcategoryId: raw.subcategoryId,
      brandName: brandName || undefined,
      images: raw.images
        ? raw.images
            .split(',')
            .map((url) => url.trim())
            .filter(Boolean)
        : undefined,
      ...(raw.type === 'PRODUCT'
        ? {
            stock: raw.stock!,
            sku: raw.sku,
            model: raw.model || undefined,
          }
        : {
            durationValue: raw.durationValue ?? undefined,
            durationUnit: raw.durationUnit || undefined,
            serviceMode: raw.serviceMode || undefined,
            coverageZone: raw.coverageZone || undefined,
          }),
    };

    const id = this.editingId();
    const request$ = id
      ? this.inventoryService.update(id, request)
      : this.inventoryService.create(request);
    request$.subscribe({
      next: () => this.router.navigateByUrl('/associate/items'),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al guardar'),
    });
  }

  private applyTypeValidators(type: ItemType) {
    const { stock, sku } = this.form.controls;
    if (type === 'PRODUCT') {
      stock.setValidators([Validators.required, Validators.min(0)]);
      sku.setValidators(Validators.required);
    } else {
      stock.clearValidators();
      sku.clearValidators();
    }
    stock.updateValueAndValidity();
    sku.updateValueAndValidity();
  }

  // ponytail: no hay GET /associate/items/{id}; se busca en el inventario paginado (tope 200).
  private loadItem(id: string) {
    this.inventoryService.list({ size: 200 }).subscribe((page) => {
      const item = page.content.find((i) => i.id === id);
      if (!item) {
        this.errorMessage.set('No se encontró la publicación.');
        return;
      }
      this.patchFromItem(item);
    });
  }

  private patchFromItem(item: ItemResponse) {
    this.brand.set(item.brand?.name ?? null);
    this.form.patchValue({
      type: item.type,
      title: item.title,
      description: item.description ?? '',
      price: item.price,
      subcategoryId: item.subcategory.id,
      stock: item.stock,
      sku: item.sku ?? '',
      model: item.model ?? '',
      durationValue: item.durationValue,
      durationUnit: item.durationUnit ?? '',
      serviceMode: item.serviceMode ?? '',
      coverageZone: item.coverageZone ?? '',
      images: item.images.join(', '),
    });
  }
}
