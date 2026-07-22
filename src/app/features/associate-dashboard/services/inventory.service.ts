import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { ItemResponse, ItemType } from '../../storefront/models/catalog.models';
import { ItemCreateRequest } from '../models/inventory.models';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  list(options: { type?: ItemType; page?: number; size?: number } = {}) {
    let params = new HttpParams();
    if (options.type) params = params.set('type', options.type);
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    return this.http
      .get<ApiResponse<PageResponse<ItemResponse>>>(`${this.url}/associate/items`, { params })
      .pipe(map((res) => res.data));
  }

  create(request: ItemCreateRequest) {
    return this.http
      .post<ApiResponse<ItemResponse>>(`${this.url}/associate/items`, request)
      .pipe(map((res) => res.data));
  }

  update(itemId: string, request: ItemCreateRequest) {
    return this.http
      .put<ApiResponse<ItemResponse>>(`${this.url}/associate/items/${itemId}`, request)
      .pipe(map((res) => res.data));
  }

  setStatus(itemId: string, active: boolean) {
    return this.http
      .put<ApiResponse<ItemResponse>>(`${this.url}/associate/items/${itemId}/status`, { active })
      .pipe(map((res) => res.data));
  }
}
