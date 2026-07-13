import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'core-layout',
  imports: [RouterOutlet, ToggleSwitchModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  themeService = inject(ThemeService);
}
