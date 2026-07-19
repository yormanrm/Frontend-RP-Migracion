import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CategoryResponse } from '../models/catalog.models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  getCategories() {
    return this.http
      .get<ApiResponse<CategoryResponse[]>>(`${this.url}/categories`)
      .pipe(map((res) => res.data));
  }
}
