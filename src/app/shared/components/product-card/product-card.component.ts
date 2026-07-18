import { Component, input } from '@angular/core';
import { Product } from '../../../core/models/product';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card'; 

@Component({
  selector: 'product-card',
  imports: [
    CurrencyPipe,
    RouterLink,
    CardModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();
}