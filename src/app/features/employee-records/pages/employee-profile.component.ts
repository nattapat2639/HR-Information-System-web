import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FilterField, PageAction, PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, PageLayoutComponent],
  template: `
    <section class="space-y-6">
      <app-page-layout
        moduleKey="employee-records"
        pageKey="profile"
        pageTitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.TITLE"
        pageSubtitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.SUBTITLE"
        contentTitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.CONTENT_TITLE"
        contentSubtitleKey="PAGES.EMPLOYEE_RECORDS.PROFILE.CONTENT_SUBTITLE"
        todoKey="PAGES.EMPLOYEE_RECORDS.PROFILE.TODO"
        [actions]="actions"
        [filterFields]="filterFields"
        [tableHeaderKeys]="[]"
        [showExportButton]="false"
      ></app-page-layout>

      <div class="grid gap-4 xl:grid-cols-3">
        <div
          *ngFor="let card of summaryCards; trackBy: trackByCard"
          class="card card-padding"
        >
          <h3 class="text-sm font-semibold text-gray-900">{{ card.titleKey | translate }}</h3>
          <dl class="mt-3 space-y-3 text-sm">
            <div
              *ngFor="let item of card.items; trackBy: trackByItem"
              class="flex flex-col gap-1"
            >
              <dt class="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                {{ item.labelKey | translate }}
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
              *ngFor="let event of timeline; let index = index; trackBy: trackByTimeline"
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
                  {{ event.categoryKey | translate }}
                </span>
              </div>
              <p class="mt-2 text-sm font-semibold text-gray-900">
                {{ event.title | translate }}
              </p>
              <p class="text-sm text-gray-600">
                {{ event.description | translate }}
              </p>
            </li>
          </ol>
        </div>

        <div class="card card-padding">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.TITLE' | translate }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.SUBTITLE' | translate }}
          </p>
          <ul class="mt-4 space-y-3">
            <li
              *ngFor="let document of documents; trackBy: trackByDocument"
              class="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">{{ document.name | translate }}</p>
                <p class="text-[11px] text-gray-500">
                  {{ 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.UPDATED' | translate:{ date: (document.updated | date:'d MMM yyyy') } }}
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
          </ul>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeProfileComponent {
  protected readonly actions: PageAction[] = [
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.ACTIONS.EDIT', icon: 'edit', variant: 'primary' },
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.ACTIONS.DOWNLOAD', icon: 'download', variant: 'secondary' },
    { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.ACTIONS.MORE', icon: 'more_horiz', variant: 'ghost' }
  ];

  protected readonly filterFields: FilterField[] = [
    {
      labelKey: 'COMMON.FIELDS.EMPLOYEE_ID',
      type: 'text',
      placeholderKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.PLACEHOLDER.EMPLOYEE_ID',
      queryKey: 'employeeId'
    },
    {
      labelKey: 'COMMON.FIELDS.DEPARTMENT',
      type: 'select',
      queryKey: 'department',
      options: [
        { labelKey: 'COMMON.DEPARTMENTS.HR', value: 'People Operations' },
        { labelKey: 'COMMON.DEPARTMENTS.IT', value: 'Technology' },
        { labelKey: 'COMMON.DEPARTMENTS.FINANCE', value: 'Finance' }
      ]
    }
  ];

  protected readonly summaryCards = [
    {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.PERSONAL',
      items: [
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.EMPLOYEE_ID', value: 'TECH-001' },
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.NATIONAL_ID', value: '3-5807-00992-21-5' },
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.BIRTHDATE', value: '24 Jul 1993' }
      ]
    },
    {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.JOB',
      items: [
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.TITLE', value: 'Principal Platform Engineer' },
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.MANAGER', value: 'Oranicha Mek' },
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.LOCATION', value: 'Headquarters • Hybrid' }
      ]
    },
    {
      titleKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.CONTACT',
      items: [
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.EMAIL', value: 'anuwat.khem@example.com' },
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.PHONE', value: '+66 81 234 5678' },
        { labelKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.CARDS.EMERGENCY', value: 'Chalisa Khem • +66 81 765 4321' }
      ]
    }
  ];

  protected readonly timeline = [
    {
      date: new Date('2025-03-04T00:00:00Z'),
      categoryKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.CATEGORIES.PROMOTION',
      tone: 'promotion',
      title: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.PROMOTION_TITLE',
      description: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.PROMOTION_DESC',
      icon: 'upgrade'
    },
    {
      date: new Date('2024-11-18T00:00:00Z'),
      categoryKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.CATEGORIES.RECOGNITION',
      tone: 'recognition',
      title: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.RECOGNITION_TITLE',
      description: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.RECOGNITION_DESC',
      icon: 'emoji_events'
    },
    {
      date: new Date('2024-06-12T00:00:00Z'),
      categoryKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.CATEGORIES.TRANSFER',
      tone: 'transfer',
      title: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.TRANSFER_TITLE',
      description: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.TRANSFER_DESC',
      icon: 'sync_alt'
    },
    {
      date: new Date('2023-12-02T00:00:00Z'),
      categoryKey: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.CATEGORIES.DEVELOPMENT',
      tone: 'development',
      title: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.DEVELOPMENT_TITLE',
      description: 'PAGES.EMPLOYEE_RECORDS.PROFILE.TIMELINE.EVENTS.DEVELOPMENT_DESC',
      icon: 'school'
    }
  ];

  protected readonly documents = [
    { name: 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.CONTRACT', updated: new Date('2025-03-01T00:00:00Z') },
    { name: 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.PERFORMANCE', updated: new Date('2024-12-18T00:00:00Z') },
    { name: 'PAGES.EMPLOYEE_RECORDS.PROFILE.DOCUMENTS.CERTIFICATION', updated: new Date('2024-06-10T00:00:00Z') }
  ];

  protected trackByCard(_: number, card: { titleKey: string }): string {
    return card.titleKey;
  }

  protected trackByItem(_: number, item: { labelKey: string }): string {
    return item.labelKey;
  }

  protected trackByTimeline(_: number, item: { title: string; date: Date }): string {
    return `${item.title}-${item.date.toISOString()}`;
  }

  protected trackByDocument(_: number, item: { name: string }): string {
    return item.name;
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
    if (normalized.includes('development')) {
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
    if (normalized.includes('development')) {
      return 'bg-amber-500';
    }
    return 'bg-slate-400';
  }
}
