import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { ItemResponse, ItemSearchParams, ItemSummaryResponse } from '../models/catalog.models';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  searchItems(params: ItemSearchParams) {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    }

    return this.http
      .get<ApiResponse<PageResponse<ItemSummaryResponse>>>(`${this.url}/items`, {
        params: httpParams,
      })
      .pipe(map((res) => res.data));
  }

  getItemBySlug(slug: string) {
    return this.http
      .get<ApiResponse<ItemResponse>>(`${this.url}/items/${slug}`)
      .pipe(map((res) => res.data));
  }
}
