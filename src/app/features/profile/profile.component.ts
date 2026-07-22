import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { AuthService } from '../../core/services/auth.service';
import { AddressListComponent } from './addresses/address-list.component';
import { AssociateProfileComponent } from './associate-profile/associate-profile.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';

@Component({
  selector: 'app-profile',
  imports: [CustomerProfileComponent, AssociateProfileComponent, AddressListComponent, TabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <p-tabs value="profile">
        <p-tablist>
          <p-tab value="profile">Mi perfil</p-tab>
          <p-tab value="addresses">Mis direcciones</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="profile">
            @switch (authService.currentUser()?.role) {
              @case ('CUSTOMER') {
                <app-customer-profile />
              }
              @case ('ASSOCIATE') {
                <app-associate-profile />
              }
            }
          </p-tabpanel>
          <p-tabpanel value="addresses">
            <app-address-list />
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class ProfileComponent {
  authService = inject(AuthService);
}
