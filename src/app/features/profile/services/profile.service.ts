import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  AssociateProfileResponse,
  AssociateProfileUpdateRequest,
  CustomerProfileResponse,
  CustomerProfileUpdateRequest,
} from '../models/profile.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getMe() {
    return this.http
      .get<ApiResponse<CustomerProfileResponse | AssociateProfileResponse>>(
        `${environment.baseApiURL}/profile/me`,
      )
      .pipe(map((res) => res.data));
  }

  updateCustomer(request: CustomerProfileUpdateRequest) {
    return this.http
      .put<ApiResponse<CustomerProfileResponse>>(
        `${environment.baseApiURL}/profile/me/customer`,
        request,
      )
      .pipe(map((res) => res.data));
  }

  updateAssociate(request: AssociateProfileUpdateRequest) {
    return this.http
      .put<ApiResponse<AssociateProfileResponse>>(
        `${environment.baseApiURL}/profile/me/associate`,
        request,
      )
      .pipe(map((res) => res.data));
  }
}
