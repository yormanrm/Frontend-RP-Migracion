import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PageResponse } from '../../../core/models/page-response.model';
import { LoginResponse, RegisterCustomerRequest } from '../../auth/models/auth.models';
import {
  BrandResponse,
  CategoryResponse,
  ItemResponse,
  ItemType,
  SubcategoryResponse,
} from '../../storefront/models/catalog.models';
import { AdminUserSummaryResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  // No pasa por AuthService: crear otro admin no debe tocar la sesión propia.
  registerAdmin(request: RegisterCustomerRequest) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.url}/auth/register/admin`, request)
      .pipe(map((res) => res.data));
  }

  listUsers(options: { page?: number; size?: number } = {}) {
    let params = new HttpParams();
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    return this.http
      .get<ApiResponse<PageResponse<AdminUserSummaryResponse>>>(`${this.url}/admin/users`, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  setUserStatus(userId: string, active: boolean) {
    return this.http
      .put<ApiResponse<null>>(`${this.url}/admin/users/${userId}/status`, { active })
      .pipe(map((res) => res.data));
  }

  listItems(options: { type?: ItemType; active?: boolean; page?: number; size?: number } = {}) {
    let params = new HttpParams();
    if (options.type) params = params.set('type', options.type);
    if (options.active !== undefined) params = params.set('active', options.active);
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    return this.http
      .get<ApiResponse<PageResponse<ItemResponse>>>(`${this.url}/admin/items`, { params })
      .pipe(map((res) => res.data));
  }

  setItemStatus(itemId: string, active: boolean) {
    return this.http
      .put<ApiResponse<null>>(`${this.url}/admin/items/${itemId}/status`, { active })
      .pipe(map((res) => res.data));
  }

  createCategory(name: string) {
    return this.http
      .post<ApiResponse<CategoryResponse>>(`${this.url}/categories`, { name })
      .pipe(map((res) => res.data));
  }

  updateCategory(id: string, name: string) {
    return this.http
      .put<ApiResponse<CategoryResponse>>(`${this.url}/categories/${id}`, { name })
      .pipe(map((res) => res.data));
  }

  deleteCategory(id: string) {
    return this.http
      .delete<ApiResponse<null>>(`${this.url}/categories/${id}`)
      .pipe(map((res) => res.data));
  }

  createSubcategory(name: string, categoryId: string) {
    return this.http
      .post<ApiResponse<SubcategoryResponse>>(`${this.url}/subcategories`, { name, categoryId })
      .pipe(map((res) => res.data));
  }

  updateSubcategory(id: string, name: string, categoryId: string) {
    return this.http
      .put<ApiResponse<SubcategoryResponse>>(`${this.url}/subcategories/${id}`, {
        name,
        categoryId,
      })
      .pipe(map((res) => res.data));
  }

  deleteSubcategory(id: string) {
    return this.http
      .delete<ApiResponse<null>>(`${this.url}/subcategories/${id}`)
      .pipe(map((res) => res.data));
  }

  updateBrand(id: string, name: string) {
    return this.http
      .put<ApiResponse<BrandResponse>>(`${this.url}/brands/${id}`, { name })
      .pipe(map((res) => res.data));
  }

  deleteBrand(id: string) {
    return this.http
      .delete<ApiResponse<null>>(`${this.url}/brands/${id}`)
      .pipe(map((res) => res.data));
  }
}
