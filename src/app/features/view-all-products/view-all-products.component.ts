import { Component, ChangeDetectionStrategy, effect, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'feature-view-all-products',
  imports: [
    ProductCardComponent
  ],
  templateUrl: './view-all-products.component.html',
  styleUrl: './view-all-products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class viewAllProductsComponent implements OnInit {
  private productsService = inject(ProductsService);
  items = this.productsService.getProducts();

  constructor() {
    effect(() => {
      this.productsService.loadProducts();
    });
  }

  ngOnInit(): void {}
}