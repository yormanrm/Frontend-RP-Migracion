import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { BrandResponse } from '../models/catalog.models';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  searchBrands(q: string) {
    return this.http
      .get<ApiResponse<BrandResponse[]>>(`${this.url}/brands`, { params: q ? { q } : {} })
      .pipe(map((res) => res.data));
  }
}
