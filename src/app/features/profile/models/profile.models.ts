export interface CustomerProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface CustomerProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface AssociateProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  storeName: string;
  storeSlug: string;
  taxId: string | null;
  publicBio: string | null;
  publicContactEmail: string | null;
  publicContactPhone: string | null;
}

export interface AssociateProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  storeName: string;
  taxId?: string;
  publicBio?: string;
  publicContactEmail?: string;
  publicContactPhone?: string;
}
