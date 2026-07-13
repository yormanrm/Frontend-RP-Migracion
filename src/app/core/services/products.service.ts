import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  private products = signal<Product[]>([]);

  getProducts = () => this.products.asReadonly();

  loadProducts() {
    this.http.get<Product[]>(`${this.url}/products`).subscribe({
      next: (data) => this.products.set(data),
      error: (error) => console.error('Error:', error),
    });
  }
}