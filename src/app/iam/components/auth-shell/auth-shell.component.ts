import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-auth-shell',
  imports: [LanguageSwitcherComponent, MatCardModule, TranslatePipe],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.css'
})
export class AuthShellComponent {
  @Input({ required: true }) eyebrowKey!: string;
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) subtitleKey!: string;
}
