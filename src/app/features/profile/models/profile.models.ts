import { Address } from '../../../core/models/common.models';

export interface CustomerProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export interface CustomerProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AssociateProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  storeName: string;
  storeSlug: string;
  rfc: string;
  storeAddress: Address | null;
  publicBio: string | null;
  publicContactEmail: string | null;
  publicContactPhone: string | null;
}

export interface AssociateProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  storeName: string;
  storeAddress?: Address;
  publicBio?: string;
  publicContactEmail?: string;
  publicContactPhone?: string;
}

export interface UserAddressResponse extends Address {
  id: string;
  isDefault: boolean;
}
