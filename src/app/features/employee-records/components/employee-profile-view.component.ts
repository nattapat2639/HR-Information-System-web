import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeDocument, EmployeeProfile } from '../models/employee-profile.model';

@Component({
  selector: 'app-employee-profile-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="space-y-6">
      <div *ngIf="loading; else content" class="flex justify-center py-12">
        <span class="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></span>
      </div>

      <ng-template #content>
        <ng-container *ngIf="profile; else fallback">
          <div class="grid gap-4 xl:grid-cols-3">
            <div
              *ngFor="let section of profileSections(); trackBy: trackBySection"
              class="card card-padding"
            >
              <h3 class="text-sm font-semibold text-gray-900">
                {{ section.titleKey | translate }}
              </h3>
              <dl class="mt-3 space-y-3 text-sm">
                <div
                  *ngFor="let item of section.fields; trackBy: trackByField"
                  class="flex flex-col gap-1"
                >
                  <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                    {{ item.label | translate }}
                  </dt>
                  <dd class="font-medium text-gray-900">
                    {{ item.value }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="grid gap-4 xl:grid-cols-3">
            <div class="card card-padding xl:col-span-2">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-900">
                  {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.TITLE' | translate }}
                </h3>
                <span class="text-xs text-gray-500">
                  {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.SUBTITLE' | translate }}
                </span>
              </div>
              <ol class="relative mt-6 space-y-6 border-l border-gray-200 pl-6">
                <li
                  *ngFor="let event of profile.timeline; trackBy: trackByTimeline"
                  class="relative"
                >
                  <span
                    class="absolute -left-[7px] flex h-3 w-3 items-center justify-center rounded-full border border-white"
                    [ngClass]="timelineNodeClass(event.tone)"
                  ></span>
                  <div class="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
                    <span class="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {{ event.date | date:'d MMM yyyy' }}
                    </span>
                    <span
                      class="inline-flex items-center gap-2 rounded-full px-2 py-1 text-[11px] font-semibold"
                      [ngClass]="timelineBadgeClass(event.tone)"
                    >
                      <span class="material-icons text-[14px]">{{ event.icon }}</span>
                      {{ event.category | translate }}
                    </span>
                  </div>
                  <p class="mt-2 text-sm font-semibold text-gray-900">
                    {{ event.title }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ event.description }}
                  </p>
                </li>
              </ol>
            </div>

            <div class="card card-padding space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-900">
                  {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.TITLE' | translate }}
                </h3>
                <p class="text-xs text-gray-500">
                  {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.SUBTITLE' | translate }}
                </p>
              </div>
              <ul class="space-y-3">
                <li
                  *ngFor="let document of profile.documents; trackBy: trackByDocument"
                  class="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ document.name | translate }}</p>
                    <p class="text-[11px] text-gray-500">
                      {{
                        'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.UPDATED'
                          | translate:{ date: (document.updatedAt | date:'d MMM yyyy') }
                      }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span class="material-icons text-[16px]">download</span>
                    {{ 'COMMON.ACTIONS.EXPORT' | translate }}
                  </button>
                </li>
                <li *ngIf="profile.documents.length === 0" class="text-xs text-gray-500">
                  {{ 'COMMON.TABLE.NO_DATA' | translate }}
                </li>
              </ul>
            </div>
          </div>
        </ng-container>
      </ng-template>

      <ng-template #fallback>
        <div class="card card-padding text-sm text-gray-500">
          {{ errorMessage ? (errorMessage | translate) : ('PAGES.EMPLOYEE_RECORDS.PROFILE.EMPTY' | translate) }}
        </div>
      </ng-template>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileViewComponent {
  @Input({ required: true }) profile: EmployeeProfile | null = null;
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  protected profileSections(): Array<{ titleKey: string; fields: { label: string; value: string }[] }> {
    if (!this.profile) {
      return [];
    }

    return [
      { titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.PERSONAL', fields: this.profile.personal },
      { titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.JOB', fields: this.profile.job },
      { titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.CONTACT', fields: this.profile.contact }
    ];
  }

  protected trackBySection(_: number, section: { titleKey: string }): string {
    return section.titleKey;
  }

  protected trackByField(_: number, field: { label: string; value: string }): string {
    return `${field.label}-${field.value}`;
  }

  protected trackByTimeline(_: number, event: EmployeeProfile['timeline'][number]): string {
    return `${event.title}-${event.date}`;
  }

  protected trackByDocument(_: number, document: EmployeeDocument): string {
    return document.name;
  }

  protected timelineBadgeClass(tone: string): string {
    const normalized = tone.toLowerCase();
    if (normalized.includes('promotion')) {
      return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    }
    if (normalized.includes('recognition')) {
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    }
    if (normalized.includes('transfer')) {
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    }
    if (normalized.includes('development') || normalized.includes('training')) {
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  protected timelineNodeClass(tone: string): string {
    const normalized = tone.toLowerCase();
    if (normalized.includes('promotion')) {
      return 'bg-indigo-500';
    }
    if (normalized.includes('recognition')) {
      return 'bg-emerald-500';
    }
    if (normalized.includes('transfer')) {
      return 'bg-blue-500';
    }
    if (normalized.includes('development') || normalized.includes('training')) {
      return 'bg-amber-500';
    }
    return 'bg-slate-400';
  }
}
