import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AssociateProfileComponent } from './associate-profile/associate-profile.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';

@Component({
  selector: 'app-profile',
  imports: [CustomerProfileComponent, AssociateProfileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      @switch (authService.currentUser()?.role) {
        @case ('CUSTOMER') {
          <app-customer-profile />
        }
        @case ('ASSOCIATE') {
          <app-associate-profile />
        }
      }
    </div>
  `,
})
export class ProfileComponent {
  authService = inject(AuthService);
}
