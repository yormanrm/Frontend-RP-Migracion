import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AddToCartRequest, CartResponse, UpdateCartItemRequest } from '../models/cart.models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private url = `${environment.baseApiURL}/cart`;

  cart = signal<CartResponse | null>(null);

  getCart() {
    return this.http.get<ApiResponse<CartResponse>>(this.url).pipe(
      map((res) => res.data),
      tap((cart) => this.cart.set(cart)),
    );
  }

  addToCart(request: AddToCartRequest) {
    return this.http.post<ApiResponse<CartResponse>>(this.url, request).pipe(
      map((res) => res.data),
      tap((cart) => this.cart.set(cart)),
    );
  }

  updateCartItem(cartItemId: string, request: UpdateCartItemRequest) {
    return this.http.put<ApiResponse<CartResponse>>(`${this.url}/items/${cartItemId}`, request).pipe(
      map((res) => res.data),
      tap((cart) => this.cart.set(cart)),
    );
  }

  clearCart() {
    return this.http.delete<ApiResponse<CartResponse>>(this.url).pipe(
      map((res) => res.data),
      tap((cart) => this.cart.set(cart)),
    );
  }
}
