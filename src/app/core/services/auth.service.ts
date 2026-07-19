import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterAssociateRequest,
  RegisterCustomerRequest,
  Role,
} from '../../features/auth/models/auth.models';
import { ApiResponse } from '../models/api-response.model';

const TOKEN_KEY = 'access_token';

export interface CurrentUser {
  id: string;
  role: Role;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private url = environment.baseApiURL;

  currentUser = signal<CurrentUser | null>(this.decodeToken(localStorage.getItem(TOKEN_KEY)));

  login(request: LoginRequest) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.url}/auth/login`, request).pipe(
      map((res) => res.data),
      tap((data) => this.setSession(data)),
    );
  }

  registerCustomer(request: RegisterCustomerRequest) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.url}/auth/register/customer`, request)
      .pipe(
        map((res) => res.data),
        tap((data) => this.setSession(data)),
      );
  }

  registerAssociate(request: RegisterAssociateRequest) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.url}/auth/register/associate`, request)
      .pipe(
        map((res) => res.data),
        tap((data) => this.setSession(data)),
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }

  private setSession(data: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    this.currentUser.set(this.decodeToken(data.accessToken));
  }

  private decodeToken(token: string | null): CurrentUser | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(payload));
      return { id: json.sub, role: json.role };
    } catch {
      return null;
    }
  }
}
