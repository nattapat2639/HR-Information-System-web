import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { AuthContextService } from '../../../core/services/auth-context.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <section class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div class="w-full max-w-md space-y-6">
        <div class="text-center space-y-2">
          <h1 class="text-2xl font-semibold text-gray-900">
            {{ 'AUTH.LOGIN.HEADLINE' | translate }}
          </h1>
          <p class="text-sm text-gray-600">
            {{ 'AUTH.LOGIN.SUBHEAD' | translate }}
          </p>
        </div>

        <form
          class="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          autocomplete="off"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700" for="email">
              {{ 'AUTH.LOGIN.FIELDS.EMAIL' | translate }}
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              [class.border-red-400]="hasControlError('email')"
            />
            <p *ngIf="hasControlError('email')" class="text-xs text-red-600">
              {{ 'AUTH.LOGIN.ERRORS.EMAIL' | translate }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700" for="password">
              {{ 'AUTH.LOGIN.FIELDS.PASSWORD' | translate }}
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              [class.border-red-400]="hasControlError('password')"
            />
            <p *ngIf="hasControlError('password')" class="text-xs text-red-600">
              {{ 'AUTH.LOGIN.ERRORS.PASSWORD' | translate }}
            </p>
          </div>

          <div *ngIf="errorMessage()" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {{ errorMessage() | translate }}
          </div>

          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
            [disabled]="loading()"
          >
            <span class="material-icons text-[18px]" *ngIf="!loading()">lock_open</span>
            <span class="material-icons text-[18px] animate-spin" *ngIf="loading()">autorenew</span>
            {{ loading() ? ('AUTH.LOGIN.ACTIONS.SIGNING_IN' | translate) : ('AUTH.LOGIN.ACTIONS.SIGN_IN' | translate) }}
          </button>

          <p class="text-center text-[11px] text-gray-500">
            {{ 'AUTH.LOGIN.HINT' | translate:{ admin: adminPassword, manager: managerPassword, user: userPassword } }}
          </p>
        </form>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authContext = inject(AuthContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly adminPassword = 'Admin@123';
  protected readonly managerPassword = 'Manager@123';
  protected readonly userPassword = 'Employee@123';

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  private redirectUrl: string | null = null;

  ngOnInit(): void {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');

    if (this.authContext.isAuthenticated()) {
      const target = this.redirectUrl || '/dashboard';
      this.router.navigateByUrl(target);
    }
  }

  protected hasControlError(controlName: 'email' | 'password'): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const payload = this.form.getRawValue();

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.authContext.applyLogin(response);
        const target = this.redirectUrl || '/dashboard';
        this.router.navigateByUrl(target);
      },
      error: (error) => {
        const message = error?.error?.message ?? 'AUTH.LOGIN.ERRORS.INVALID';
        this.errorMessage.set(message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
