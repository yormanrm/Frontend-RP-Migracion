import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { ItemResponse, ItemSearchRequest, ItemSummaryResponse } from '../models/catalog.models';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  searchItems(request: ItemSearchRequest) {
    return this.http
      .post<ApiResponse<PageResponse<ItemSummaryResponse>>>(`${this.url}/items/search`, request)
      .pipe(map((res) => res.data));
  }

  getItemBySlug(slug: string) {
    return this.http
      .get<ApiResponse<ItemResponse>>(`${this.url}/items/${slug}`)
      .pipe(map((res) => res.data));
  }
}
