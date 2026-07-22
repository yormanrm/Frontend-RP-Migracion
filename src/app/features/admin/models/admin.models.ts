import { Role } from '../../auth/models/auth.models';

export interface AdminUserSummaryResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  active: boolean;
  createdAt: string;
}
