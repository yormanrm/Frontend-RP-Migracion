import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { AdminBrandsComponent } from '../admin-brands/admin-brands.component';
import { AdminCategoriesComponent } from '../admin-categories/admin-categories.component';
import { AdminItemsComponent } from '../admin-items/admin-items.component';
import { AdminRegisterComponent } from '../admin-register/admin-register.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';

@Component({
  selector: 'app-admin-panel',
  imports: [
    TabsModule,
    AdminUsersComponent,
    AdminItemsComponent,
    AdminCategoriesComponent,
    AdminBrandsComponent,
    AdminRegisterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="mb-6 text-2xl font-semibold text-slate-800">Panel de administración</h2>
    <p-tabs value="users">
      <p-tablist>
        <p-tab value="users">Usuarios</p-tab>
        <p-tab value="items">Publicaciones</p-tab>
        <p-tab value="categories">Categorías</p-tab>
        <p-tab value="brands">Marcas</p-tab>
        <p-tab value="register">Nuevo admin</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel value="users"><app-admin-users /></p-tabpanel>
        <p-tabpanel value="items"><app-admin-items /></p-tabpanel>
        <p-tabpanel value="categories"><app-admin-categories /></p-tabpanel>
        <p-tabpanel value="brands"><app-admin-brands /></p-tabpanel>
        <p-tabpanel value="register"><app-admin-register /></p-tabpanel>
      </p-tabpanels>
    </p-tabs>
  `,
})
export class AdminPanelComponent {}
