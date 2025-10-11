import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  readonly languages = this.languageService.languages;
  readonly activeLanguage = this.languageService.currentLanguage;
  readonly notificationBadge = 3;

  constructor(private readonly languageService: LanguageService) {}

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  switchLanguage(code: string): void {
    this.languageService.use(code);
  }

  trackByCode(_: number, item: { code: string }): string {
    return item.code;
  }
}
