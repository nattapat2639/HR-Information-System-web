import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { AuthContextService } from '../../services/auth-context.service';
import { Router } from '@angular/router';
import { computed } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  private readonly authContext = inject(AuthContextService);
  private readonly router = inject(Router);

  readonly languages = this.languageService.languages;
  readonly activeLanguage = this.languageService.currentLanguage;
  readonly notificationBadge = 3;
  readonly displayName = computed(() => this.authContext.displayName());
  readonly primaryRole = computed(() => this.authContext.activeRoles()[0] ?? '');

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

  logout(): void {
    this.authContext.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
