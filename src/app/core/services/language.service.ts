import { Injectable, computed, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface LanguageOption {
  code: string;
  labelKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly activeLanguage = signal<string>('en');

  readonly languages = signal<LanguageOption[]>([
    { code: 'en', labelKey: 'APP.LANGUAGE.EN' },
    { code: 'th', labelKey: 'APP.LANGUAGE.TH' }
  ]);

  readonly currentLanguage = computed(() => this.activeLanguage());

  constructor(private readonly translate: TranslateService) {
    const initial = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    this.activeLanguage.set(initial);
    this.translate.onLangChange.subscribe(({ lang }) => this.activeLanguage.set(lang));
  }

  use(code: string): void {
    if (code === this.activeLanguage()) {
      return;
    }
    this.translate.use(code);
    this.activeLanguage.set(code);
  }
}
