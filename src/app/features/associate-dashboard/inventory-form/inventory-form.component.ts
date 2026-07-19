import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryResponse } from '../../storefront/models/catalog.models';
import { CategoryService } from '../../storefront/services/category.service';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-inventory-form',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card header="Nuevo producto" styleClass="mx-auto max-w-md">
      @if (errorMessage()) {
        <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
      }
      <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="title" class="text-sm font-medium text-slate-700">Título</label>
          <input pInputText id="title" type="text" formControlName="title" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="slug" class="text-sm font-medium text-slate-700">Slug</label>
          <input pInputText id="slug" type="text" formControlName="slug" />
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
          <label for="price" class="text-sm font-medium text-slate-700">Precio</label>
          <input pInputText id="price" type="number" formControlName="price" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="stock" class="text-sm font-medium text-slate-700">Stock</label>
          <input pInputText id="stock" type="number" formControlName="stock" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="categoryId" class="text-sm font-medium text-slate-700">Categoría</label>
          <select
            id="categoryId"
            formControlName="categoryId"
            class="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Selecciona</option>
            @for (category of categories(); track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
        </div>
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
  private router = inject(Router);

  categories = signal<CategoryResponse[]>([]);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    stock: [0, Validators.required],
    categoryId: ['', Validators.required],
    images: [''],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => this.categories.set(data));
  }

  submit() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const request = {
      title: raw.title,
      slug: raw.slug,
      description: raw.description || undefined,
      price: raw.price,
      stock: raw.stock,
      categoryId: raw.categoryId,
      images: raw.images
        ? raw.images
            .split(',')
            .map((url) => url.trim())
            .filter(Boolean)
        : undefined,
    };

    this.inventoryService.create(request).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.errorMessage.set(err.error?.message ?? 'Error al guardar producto'),
    });
  }
}
