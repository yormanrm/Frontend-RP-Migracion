import { Component, ChangeDetectionStrategy, effect, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'feature-view-all-products',
  imports: [],
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

  ngOnInit(): void {
    
  }
}