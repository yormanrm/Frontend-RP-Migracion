import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <app-navbar></app-navbar>
      <main class="container mx-auto flex-1 px-4 py-8">
        <router-outlet></router-outlet>
      </main>
      <footer class="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        © Frontend RP Migración
      </footer>
    </div>
  `
})
export class App {
  protected readonly title = signal('Frontend-RP-Migracion');
}