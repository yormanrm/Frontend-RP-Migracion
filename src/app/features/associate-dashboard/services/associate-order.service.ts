import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { AssociateOrderResponse, OrderStatus } from '../../checkout/models/order.models';
import { AssociateSalesReportResponse } from '../models/sales-report.models';

@Injectable({
  providedIn: 'root',
})
export class AssociateOrderService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  list(options: { status?: OrderStatus; from?: string; to?: string; page?: number; size?: number } = {}) {
    let params = new HttpParams();
    if (options.status) params = params.set('status', options.status);
    if (options.from) params = params.set('from', options.from);
    if (options.to) params = params.set('to', options.to);
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    return this.http
      .get<ApiResponse<PageResponse<AssociateOrderResponse>>>(`${this.url}/associate/orders`, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  salesReport(options: { from?: string; to?: string } = {}) {
    let params = new HttpParams();
    if (options.from) params = params.set('from', options.from);
    if (options.to) params = params.set('to', options.to);
    return this.http
      .get<ApiResponse<AssociateSalesReportResponse>>(`${this.url}/associate/sales-report`, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  updateStatus(subOrderId: string, status: OrderStatus) {
    return this.http
      .put<ApiResponse<AssociateOrderResponse>>(`${this.url}/associate/orders/${subOrderId}/status`, {
        status,
      })
      .pipe(map((res) => res.data));
  }
}
