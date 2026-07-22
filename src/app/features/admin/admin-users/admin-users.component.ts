import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AdminUserSummaryResponse } from '../models/admin.models';
import { AdminService } from '../services/admin.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errorMessage()) {
      <p class="mb-4 text-sm text-red-600">{{ errorMessage() }}</p>
    }
    <div class="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-slate-200 text-slate-600">
          <tr>
            <th scope="col" class="px-4 py-3">Email</th>
            <th scope="col" class="px-4 py-3">Nombre</th>
            <th scope="col" class="px-4 py-3">Rol</th>
            <th scope="col" class="px-4 py-3">Alta</th>
            <th scope="col" class="px-4 py-3">Estado</th>
            <th scope="col" class="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (user of users(); track user.id) {
            <tr class="border-b border-slate-100 text-slate-700">
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.firstName }} {{ user.lastName }}</td>
              <td class="px-4 py-3">{{ user.role }}</td>
              <td class="px-4 py-3">{{ user.createdAt | date: 'shortDate' }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium"
                  [class]="user.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'"
                >
                  {{ user.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p-button
                  [label]="user.active ? 'Desactivar' : 'Activar'"
                  [severity]="user.active ? 'danger' : 'success'"
                  size="small"
                  [outlined]="true"
                  (onClick)="toggle(user)"
                />
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">Sin usuarios.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex items-center justify-center gap-4">
      <p-button
        label="Anterior"
        severity="secondary"
        [disabled]="page() === 0"
        (onClick)="goToPage(page() - 1)"
      />
      <span class="text-sm text-slate-600">Página {{ page() + 1 }} de {{ totalPages() }}</span>
      <p-button
        label="Siguiente"
        severity="secondary"
        [disabled]="isLastPage()"
        (onClick)="goToPage(page() + 1)"
      />
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);

  users = signal<AdminUserSummaryResponse[]>([]);
  errorMessage = signal<string | null>(null);
  page = signal(0);
  totalPages = signal(0);
  isLastPage = signal(true);

  ngOnInit() {
    this.load();
  }

  goToPage(page: number) {
    this.page.set(page);
    this.load();
  }

  toggle(user: AdminUserSummaryResponse) {
    this.errorMessage.set(null);
    this.adminService.setUserStatus(user.id, !user.active).subscribe({
      next: () => this.load(),
      error: (err) => this.errorMessage.set(err.error?.detail ?? 'Error al cambiar el estado'),
    });
  }

  private load() {
    this.adminService.listUsers({ page: this.page(), size: PAGE_SIZE }).subscribe((data) => {
      this.users.set(data.content);
      this.totalPages.set(data.totalPages);
      this.isLastPage.set(data.last);
    });
  }
}
