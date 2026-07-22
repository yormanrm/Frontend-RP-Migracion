import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { BrandResponse } from '../../../features/storefront/models/catalog.models';
import { BrandService } from '../../../features/storefront/services/brand.service';

@Component({
  selector: 'app-brand-autocomplete',
  imports: [FormsModule, AutoCompleteModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-autoComplete
      [(ngModel)]="value"
      [suggestions]="suggestions()"
      optionLabel="name"
      [inputId]="inputId()"
      [placeholder]="placeholder()"
      [delay]="300"
      [forceSelection]="false"
      (completeMethod)="search($event)"
      styleClass="w-full"
      inputStyleClass="w-full"
    />
  `,
})
export class BrandAutocompleteComponent {
  private brandService = inject(BrandService);

  // Selección de sugerencia = BrandResponse; texto libre = string.
  value = model<BrandResponse | string | null>(null);
  inputId = input('brand');
  placeholder = input('');

  suggestions = signal<BrandResponse[]>([]);

  search(event: AutoCompleteCompleteEvent) {
    this.brandService.searchBrands(event.query).subscribe((brands) => {
      this.suggestions.set(brands);
    });
  }
}
