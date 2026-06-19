import { Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule, TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
  private readonly translate = inject(TranslateService);
  readonly currentLang = signal(this.translate.getCurrentLang() ?? 'es');

  changeLanguage(lang: string): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
  }
}
