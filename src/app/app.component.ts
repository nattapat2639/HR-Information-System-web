import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en', 'th']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
