import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { BrandAutocompleteComponent } from '../../../shared/components/brand-autocomplete/brand-autocomplete.component';
import { BrandResponse, CategoryResponse, ItemSummaryResponse, SortBy } from '../models/catalog.models';
import { CategoryService } from '../services/category.service';
import { ItemService } from '../services/item.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-item-list',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
    BrandAutocompleteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="mb-6 text-2xl font-semibold text-slate-800">Catálogo</h2>

    <form
      [formGroup]="filters"
      (ngSubmit)="search()"
      class="mb-6 flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm"
    >
      <label class="flex grow flex-col gap-1 text-sm font-medium text-slate-700">
        Buscar
        <input pInputText type="text" formControlName="q" placeholder="Título, marca, tienda..." />
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Subcategoría
        <select
          formControlName="subcategoryId"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todas</option>
          @for (category of categories(); track category.id) {
            <optgroup [label]="category.name">
              @for (sub of category.subcategories; track sub.id) {
                <option [value]="sub.id">{{ sub.name }}</option>
              }
            </optgroup>
          }
        </select>
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700" for="brand-filter">
        Marca
        <app-brand-autocomplete [(value)]="brand" inputId="brand-filter" placeholder="Todas" />
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Precio mín.
        <input pInputText type="number" formControlName="priceMin" class="w-28" />
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Precio máx.
        <input pInputText type="number" formControlName="priceMax" class="w-28" />
      </label>
      <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Orden
        <select
          formControlName="sortBy"
          class="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="recent">Recientes</option>
          <option value="bestsellers">Más vendidos</option>
          <option value="price_asc">Precio ascendente</option>
          <option value="price_desc">Precio descendente</option>
        </select>
      </label>
      <p-button type="submit" label="Filtrar" />
    </form>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      @for (item of items(); track item.id) {
        <p-card styleClass="h-full">
          <ng-template #header>
            @if (item.images[0]) {
              <img [src]="item.images[0]" alt="" class="h-48 w-full rounded-t-lg object-cover" />
            }
          </ng-template>
          <h3 class="mb-1 font-semibold text-slate-800">{{ item.title }}</h3>
          <p class="mb-1 text-sm text-slate-500">
            {{ item.subcategory.name }}
            @if (item.brand) {
              · {{ item.brand.name }}
            }
          </p>
          <p class="mb-4 font-medium text-slate-800">
            @if (item.type === 'SERVICE') {
              Desde {{ item.price }}
            } @else {
              {{ item.price }}
            }
          </p>
          <a [routerLink]="['/items', item.slug]" pButton label="Ver" styleClass="w-full"></a>
        </p-card>
      } @empty {
        <p class="text-slate-600 md:col-span-3">Sin resultados.</p>
      }
    </div>

    <div class="mt-6 flex items-center justify-center gap-4">
      <p-button
        label="Anterior"
        severity="secondary"
        [disabled]="page() === 0"
        (onClick)="goToPage(page() - 1)"
      />
      <span class="text-sm text-slate-600">Página {{ page() + 1 }} de {{ totalPages() }}</span>
      <p-button
        label="Siguiente"
        severity="secondary"
        [disabled]="isLastPage()"
        (onClick)="goToPage(page() + 1)"
      />
    </div>
  `,
})
export class ItemListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private itemService = inject(ItemService);

  categories = signal<CategoryResponse[]>([]);
  items = signal<ItemSummaryResponse[]>([]);
  brand = signal<BrandResponse | string | null>(null);
  page = signal(0);
  totalPages = signal(0);
  isLastPage = signal(true);

  filters = this.fb.nonNullable.group({
    q: [''],
    subcategoryId: [''],
    priceMin: [null as number | null],
    priceMax: [null as number | null],
    sortBy: ['recent' as SortBy],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => this.categories.set(data));
    this.loadItems();
  }

  search() {
    this.page.set(0);
    this.loadItems();
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadItems();
  }

  private loadItems() {
    const { q, subcategoryId, priceMin, priceMax, sortBy } = this.filters.getRawValue();
    const brand = this.brand();
    this.itemService
      .searchItems({
        q: q || undefined,
        subcategoryId: subcategoryId || undefined,
        brandId: typeof brand === 'object' && brand ? brand.id : undefined,
        priceMin: priceMin ?? undefined,
        priceMax: priceMax ?? undefined,
        sortBy,
        page: this.page(),
        size: PAGE_SIZE,
      })
      .subscribe((data) => {
        this.items.set(data.content);
        this.totalPages.set(data.totalPages);
        this.isLastPage.set(data.last);
      });
  }
}
