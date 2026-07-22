import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Address } from '../../../core/models/common.models';
import {
  AssociateProfileResponse,
  AssociateProfileUpdateRequest,
  CustomerProfileResponse,
  CustomerProfileUpdateRequest,
  UserAddressResponse,
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

  getAddresses() {
    return this.http
      .get<ApiResponse<UserAddressResponse[]>>(`${environment.baseApiURL}/profile/me/addresses`)
      .pipe(map((res) => res.data));
  }

  createAddress(request: Address) {
    return this.http
      .post<ApiResponse<UserAddressResponse>>(
        `${environment.baseApiURL}/profile/me/addresses`,
        request,
      )
      .pipe(map((res) => res.data));
  }

  updateAddress(addressId: string, request: Address) {
    return this.http
      .put<ApiResponse<UserAddressResponse>>(
        `${environment.baseApiURL}/profile/me/addresses/${addressId}`,
        request,
      )
      .pipe(map((res) => res.data));
  }

  deleteAddress(addressId: string) {
    return this.http
      .delete<ApiResponse<null>>(`${environment.baseApiURL}/profile/me/addresses/${addressId}`)
      .pipe(map((res) => res.data));
  }

  setDefaultAddress(addressId: string) {
    return this.http
      .put<ApiResponse<UserAddressResponse>>(
        `${environment.baseApiURL}/profile/me/addresses/${addressId}/default`,
        null,
      )
      .pipe(map((res) => res.data));
  }
}
