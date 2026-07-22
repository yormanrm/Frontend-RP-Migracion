import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CheckoutRequest, OrderResponse } from '../models/order.models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  checkout(request: CheckoutRequest = {}) {
    return this.http
      .post<ApiResponse<OrderResponse>>(`${environment.baseApiURL}/checkout`, request)
      .pipe(map((res) => res.data));
  }

  getOrders() {
    return this.http
      .get<ApiResponse<OrderResponse[]>>(`${environment.baseApiURL}/orders`)
      .pipe(map((res) => res.data));
  }

  getOrderById(orderId: string) {
    return this.http
      .get<ApiResponse<OrderResponse>>(`${environment.baseApiURL}/orders/${orderId}`)
      .pipe(map((res) => res.data));
  }
}
