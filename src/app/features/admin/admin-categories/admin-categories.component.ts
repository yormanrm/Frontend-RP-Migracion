import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryResponse, SubcategoryResponse } from '../../storefront/models/catalog.models';
import { CategoryService } from '../../storefront/services/category.service';
import { AdminService } from '../services/admin.service';

type Editing = { kind: 'category' | 'subcategory'; id: string } | null;

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errorMessage()) {
      <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
    }

    <form (ngSubmit)="createCategory()" class="mb-6 flex items-end gap-2">
      <label class="flex grow flex-col gap-1 text-sm font-medium text-slate-700">
        Nueva categoría
        <input pInputText type="text" [formControl]="newCategoryName" />
      </label>
      <p-button type="submit" label="Crear" [disabled]="newCategoryName.invalid" />
    </form>

    <div class="flex flex-col gap-4">
      @for (category of categories(); track category.id) {
        <p-card>
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
            @if (isEditing('category', category.id)) {
              <form (ngSubmit)="saveEdit(category)" class="flex grow items-center gap-2">
                <label class="sr-only" for="edit-{{ category.id }}">Nuevo nombre</label>
                <input
                  pInputText
                  id="edit-{{ category.id }}"
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
                  (onClick)="cancelEdit()"
                />
              </form>
            } @else {
              <h3 class="font-semibold text-slate-800">{{ category.name }}</h3>
              <div class="flex gap-2">
                <p-button
                  label="Renombrar"
                  severity="secondary"
                  size="small"
                  [outlined]="true"
                  (onClick)="startEdit('category', category.id, category.name)"
                />
                <p-button
                  label="Eliminar"
                  severity="danger"
                  size="small"
                  [outlined]="true"
                  (onClick)="deleteCategory(category)"
                />
              </div>
            }
          </div>

          <ul class="mb-3 flex flex-col gap-1">
            @for (sub of category.subcategories; track sub.id) {
              <li class="flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm">
                @if (isEditing('subcategory', sub.id)) {
                  <form (ngSubmit)="saveEdit(category, sub)" class="flex grow items-center gap-2">
                    <label class="sr-only" for="edit-{{ sub.id }}">Nuevo nombre</label>
                    <input
                      pInputText
                      id="edit-{{ sub.id }}"
                      type="text"
                      [formControl]="editName"
                      class="grow"
                    />
                    <p-button
                      type="submit"
                      label="Guardar"
                      size="small"
                      [disabled]="editName.invalid"
                    />
                    <p-button
                      type="button"
                      label="Cancelar"
                      severity="secondary"
                      size="small"
                      [outlined]="true"
                      (onClick)="cancelEdit()"
                    />
                  </form>
                } @else {
                  <span class="text-slate-700">{{ sub.name }}</span>
                  <span class="flex gap-2">
                    <p-button
                      label="Renombrar"
                      severity="secondary"
                      size="small"
                      [outlined]="true"
                      (onClick)="startEdit('subcategory', sub.id, sub.name)"
                    />
                    <p-button
                      label="Eliminar"
                      severity="danger"
                      size="small"
                      [outlined]="true"
                      (onClick)="deleteSubcategory(sub)"
                    />
                  </span>
                }
              </li>
            } @empty {
              <li class="text-sm text-slate-500">Sin subcategorías.</li>
            }
          </ul>

          <form (ngSubmit)="createSubcategory(category)" class="flex items-end gap-2">
            <label class="flex grow flex-col gap-1 text-sm font-medium text-slate-700">
              Nueva subcategoría
              <input pInputText type="text" [formControl]="getNewSubName(category.id)" />
            </label>
            <p-button
              type="submit"
              label="Agregar"
              size="small"
              [disabled]="getNewSubName(category.id).invalid"
            />
          </form>
        </p-card>
      } @empty {
        <p class="text-sm text-slate-500">Sin categorías.</p>
      }
    </div>
  `,
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private adminService = inject(AdminService);

  categories = signal<CategoryResponse[]>([]);
  errorMessage = signal<string | null>(null);
  editing = signal<Editing>(null);

  newCategoryName = new FormControl('', { nonNullable: true, validators: Validators.required });
  editName = new FormControl('', { nonNullable: true, validators: Validators.required });
  private newSubNames = new Map<string, FormControl<string>>();

  ngOnInit() {
    this.load();
  }

  getNewSubName(categoryId: string) {
    let control = this.newSubNames.get(categoryId);
    if (!control) {
      control = new FormControl('', { nonNullable: true, validators: Validators.required });
      this.newSubNames.set(categoryId, control);
    }
    return control;
  }

  isEditing(kind: 'category' | 'subcategory', id: string) {
    const editing = this.editing();
    return editing?.kind === kind && editing.id === id;
  }

  startEdit(kind: 'category' | 'subcategory', id: string, currentName: string) {
    this.editing.set({ kind, id });
    this.editName.setValue(currentName);
  }

  cancelEdit() {
    this.editing.set(null);
  }

  saveEdit(category: CategoryResponse, sub?: SubcategoryResponse) {
    if (this.editName.invalid) return;
    const name = this.editName.value.trim();
    const request$: Observable<unknown> = sub
      ? this.adminService.updateSubcategory(sub.id, name, category.id)
      : this.adminService.updateCategory(category.id, name);
    request$.subscribe({
      next: () => {
        this.cancelEdit();
        this.load();
      },
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al guardar'),
    });
  }

  createCategory() {
    if (this.newCategoryName.invalid) return;
    this.adminService.createCategory(this.newCategoryName.value.trim()).subscribe({
      next: () => {
        this.newCategoryName.reset();
        this.load();
      },
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al crear la categoría'),
    });
  }

  createSubcategory(category: CategoryResponse) {
    const control = this.getNewSubName(category.id);
    if (control.invalid) return;
    this.adminService.createSubcategory(control.value.trim(), category.id).subscribe({
      next: () => {
        control.reset();
        this.load();
      },
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al crear la subcategoría'),
    });
  }

  deleteCategory(category: CategoryResponse) {
    this.adminService.deleteCategory(category.id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al eliminar'),
    });
  }

  deleteSubcategory(sub: SubcategoryResponse) {
    this.adminService.deleteSubcategory(sub.id).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al eliminar'),
    });
  }

  private load() {
    this.errorMessage.set(null);
    this.categoryService.getCategories().subscribe((data) => this.categories.set(data));
  }
}
