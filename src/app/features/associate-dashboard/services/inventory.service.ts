import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ItemResponse } from '../../storefront/models/catalog.models';
import { ItemCreateRequest } from '../models/inventory.models';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  create(request: ItemCreateRequest) {
    return this.http
      .post<ApiResponse<ItemResponse>>(`${this.url}/associate/items`, request)
      .pipe(map((res) => res.data));
  }
}
