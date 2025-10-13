import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeRecordsActionsService } from '../employee-records-actions.service';
import {
  EmployeeFieldDefinition,
  EmployeeFieldDefinitionRequest,
  EmployeeFieldOption
} from '../models/employee-field-definition.model';

type OptionFormGroup = FormGroup<{
  label: FormControl<string>;
  value: FormControl<string>;
  sortOrder: FormControl<number>;
}>;

type FieldDefinitionFormGroup = FormGroup<{
  fieldKey: FormControl<string>;
  displayName: FormControl<string>;
  dataType: FormControl<string>;
  category: FormControl<string>;
  isRequired: FormControl<boolean>;
  isActive: FormControl<boolean>;
  sortOrder: FormControl<number>;
  description: FormControl<string>;
  options: FormArray<OptionFormGroup>;
}>;

@Component({
  selector: 'app-employee-field-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <section class="space-y-6">
      <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">
            {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TITLE' | translate }}
          </h1>
          <p class="text-sm text-gray-600">
            {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.SUBTITLE' | translate }}
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          (click)="openCreateDrawer()"
        >
          <span class="material-icons text-[18px]">add</span>
          {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.ADD' | translate }}
        </button>
      </header>

      <div *ngIf="successKey()" class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
        {{ successKey() | translate }}
      </div>
      <div *ngIf="errorKey()" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
        {{ errorKey() | translate }}
      </div>

      <ng-container *ngIf="!loading(); else loadingState">
        <div class="card card-padding space-y-2" *ngIf="fieldDefinitions().length > 0; else emptyState">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
              <thead class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.FIELD_KEY' | translate }}</th>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.DISPLAY_NAME' | translate }}</th>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.DATA_TYPE' | translate }}</th>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.CATEGORY' | translate }}</th>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.REQUIRED' | translate }}</th>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.ACTIVE' | translate }}</th>
                  <th class="px-4 py-3">{{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.OPTIONS' | translate }}</th>
                  <th class="px-4 py-3 text-right">{{ 'COMMON.TABLE.ACTIONS' | translate }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let definition of fieldDefinitions(); trackBy: trackByDefinition" class="align-top">
                  <td class="px-4 py-3 font-mono text-xs text-gray-600">{{ definition.fieldKey }}</td>
                  <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">{{ definition.displayName }}</div>
                    <div *ngIf="definition.description" class="text-xs text-gray-500">{{ definition.description }}</div>
                  </td>
                  <td class="px-4 py-3 text-gray-700">{{ fieldTypeDisplayName(definition.dataType) }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ definition.category }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold"
                      [ngClass]="definition.isRequired ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                    >
                      {{
                        definition.isRequired
                          ? ('COMMON.BOOLEAN.YES' | translate)
                          : ('COMMON.BOOLEAN.NO' | translate)
                      }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold"
                      [ngClass]="definition.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'"
                    >
                      {{
                        definition.isActive
                          ? ('COMMON.BOOLEAN.YES' | translate)
                          : ('COMMON.BOOLEAN.NO' | translate)
                      }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-700">
                    <span *ngIf="isOptionType(definition.dataType); else noOptions">
                      {{ definition.options.length }}
                    </span>
                    <ng-template #noOptions>—</ng-template>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        (click)="openEditDrawer(definition)"
                      >
                        <span class="material-icons text-[16px]">edit</span>
                        {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.EDIT' | translate }}
                      </button>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        (click)="confirmDelete(definition)"
                      >
                        <span class="material-icons text-[16px]">delete</span>
                        {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.DELETE' | translate }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ng-container>

      <ng-template #loadingState>
        <div class="card card-padding flex items-center justify-center">
          <span class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></span>
        </div>
      </ng-template>

      <ng-template #emptyState>
        <div class="card card-padding text-sm text-gray-500">
          {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.TABLE.EMPTY' | translate }}
        </div>
      </ng-template>
    </section>

    <div
      *ngIf="drawerOpen()"
      class="fixed inset-0 z-30 flex"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="
        editingDefinition()
          ? ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.EDIT' | translate)
          : ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.ADD' | translate)
      "
    >
      <div class="absolute inset-0 bg-gray-900/60" (click)="closeDrawer()" aria-hidden="true"></div>
      <aside class="relative ml-auto flex h-full w-full max-w-xl flex-col bg-white shadow-xl">
        <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-gray-500">
              {{
                editingDefinition()
                  ? ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.HEADINGS.EDITING' | translate)
                  : ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.HEADINGS.CREATING' | translate)
              }}
            </p>
            <h2 class="text-lg font-semibold text-gray-900">
              {{
                editingDefinition()?.displayName
                  || ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.HEADINGS.NEW_FIELD' | translate)
              }}
            </h2>
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            (click)="closeDrawer()"
            [attr.aria-label]="'COMMON.ACTIONS.CLOSE' | translate"
          >
            <span class="material-icons text-[20px]">close</span>
          </button>
        </header>

        <form class="flex-1 overflow-y-auto px-6 py-5 space-y-4" [formGroup]="form" (ngSubmit)="saveDefinition()">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.FIELD_KEY' | translate }}
              </label>
              <input
                type="text"
                formControlName="fieldKey"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p *ngIf="hasControlError('fieldKey')" class="mt-1 text-xs text-red-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.VALIDATION.FIELD_KEY' | translate }}
              </p>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.DISPLAY_NAME' | translate }}
              </label>
              <input
                type="text"
                formControlName="displayName"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p *ngIf="hasControlError('displayName')" class="mt-1 text-xs text-red-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.VALIDATION.DISPLAY_NAME' | translate }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.DATA_TYPE' | translate }}
              </label>
              <select
                formControlName="dataType"
                (change)="onDataTypeChange()"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option *ngFor="let type of fieldTypes" [value]="type.value">
                  {{ type.labelKey | translate }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.CATEGORY' | translate }}
              </label>
              <select
                formControlName="category"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option *ngFor="let category of categoryOptions" [value]="category.value">
                  {{ category.labelKey | translate }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.SORT_ORDER' | translate }}
              </label>
              <input
                type="number"
                formControlName="sortOrder"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" formControlName="isRequired" class="h-4 w-4 rounded border-gray-300" id="field-required" />
              <label for="field-required" class="text-sm text-gray-700">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.IS_REQUIRED' | translate }}
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" formControlName="isActive" class="h-4 w-4 rounded border-gray-300" id="field-active" />
              <label for="field-active" class="text-sm text-gray-700">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.IS_ACTIVE' | translate }}
              </label>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.DESCRIPTION' | translate }}
              </label>
              <textarea
                rows="3"
                formControlName="description"
                class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div *ngIf="isOptionType(form.controls.dataType.value)" formArrayName="options" class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.OPTIONS' | translate }}
              </h3>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                (click)="addOption()"
              >
                <span class="material-icons text-[16px]">add</span>
                {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.ADD_OPTION' | translate }}
              </button>
            </div>
            <p class="text-xs text-gray-500">
              {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.OPTION_HINT' | translate }}
            </p>

            <div
              class="rounded-md border border-gray-200 p-3"
              *ngFor="let optionGroup of optionGroups.controls; let i = index; trackBy: trackByOption"
              [formGroupName]="i"
            >
              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.OPTION_LABEL' | translate }}
                  </label>
                  <input
                    type="text"
                    formControlName="label"
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p *ngIf="optionHasError(i, 'label')" class="mt-1 text-xs text-red-600">
                    {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.VALIDATION.OPTION_LABEL' | translate }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.OPTION_VALUE' | translate }}
                  </label>
                  <input
                    type="text"
                    formControlName="value"
                    class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.FORM.OPTION_SORT_ORDER' | translate }}
                  </label>
                  <input
                    type="number"
                    formControlName="sortOrder"
                    class="mt-1 w-24 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  (click)="removeOption(i)"
                >
                  <span class="material-icons text-[16px]">close</span>
                  {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.REMOVE_OPTION' | translate }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (click)="closeDrawer()"
            >
              {{ 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.CANCEL' | translate }}
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70"
              [disabled]="form.invalid || submitting()"
            >
              <span
                *ngIf="submitting()"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              ></span>
              {{
                editingDefinition()
                  ? ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.SAVE_CHANGES' | translate)
                  : ('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ACTIONS.SAVE_NEW' | translate)
              }}
            </button>
          </div>
        </form>
      </aside>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFieldConfigComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly actionsService = inject(EmployeeRecordsActionsService);

  protected readonly fieldDefinitions = signal<EmployeeFieldDefinition[]>([]);
  protected readonly loading = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly editingDefinition = signal<EmployeeFieldDefinition | null>(null);
  protected readonly submitting = signal(false);
  protected readonly successKey = signal<string | null>(null);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form: FieldDefinitionFormGroup = this.fb.nonNullable.group({
    fieldKey: ['', [Validators.required, Validators.maxLength(128)]],
    displayName: ['', [Validators.required, Validators.maxLength(128)]],
    dataType: ['text', Validators.required],
    category: ['Personal', [Validators.required, Validators.maxLength(64)]],
    isRequired: [true],
    isActive: [true],
    sortOrder: [0, [Validators.min(0)]],
    description: [''],
    options: this.fb.array<OptionFormGroup>([])
  }) as FieldDefinitionFormGroup;

  protected readonly fieldTypes = [
    { value: 'text', labelKey: 'COMMON.FIELD_TYPES.TEXT' },
    { value: 'number', labelKey: 'COMMON.FIELD_TYPES.NUMBER' },
    { value: 'date', labelKey: 'COMMON.FIELD_TYPES.DATE' },
    { value: 'email', labelKey: 'COMMON.FIELD_TYPES.EMAIL' },
    { value: 'select', labelKey: 'COMMON.FIELD_TYPES.SELECT' },
    { value: 'multi_select', labelKey: 'COMMON.FIELD_TYPES.MULTI_SELECT' }
  ];

  protected readonly categoryOptions = [
    { value: 'Personal', labelKey: 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.CATEGORIES.PERSONAL' },
    { value: 'Employment', labelKey: 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.CATEGORIES.EMPLOYMENT' },
    { value: 'Compensation', labelKey: 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.CATEGORIES.COMPENSATION' },
    { value: 'Emergency', labelKey: 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.CATEGORIES.EMERGENCY' },
    { value: 'Custom', labelKey: 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.CATEGORIES.CUSTOM' }
  ];

  constructor() {
    this.loadDefinitions();
  }

  protected get optionGroups(): FormArray<OptionFormGroup> {
    return this.form.controls.options;
  }

  protected trackByDefinition(_: number, definition: EmployeeFieldDefinition): string {
    return definition.id;
  }

  protected trackByOption(index: number): number {
    return index;
  }

  protected fieldTypeDisplayName(dataType: string): string {
    const option = this.fieldTypes.find((type) => type.value === dataType);
    return option ? this.translate.instant(option.labelKey) : dataType;
  }

  protected isOptionType(dataType: string | null | undefined): boolean {
    const normalized = (dataType ?? '').toLowerCase();
    return normalized === 'select' || normalized === 'multi_select';
  }

  protected hasControlError(controlName: 'fieldKey' | 'displayName'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected optionHasError(index: number, controlName: 'label' | 'value' | 'sortOrder'): boolean {
    const group = this.optionGroups.at(index);
    if (!group) {
      return false;
    }
    const control = group.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected openCreateDrawer(): void {
    this.editingDefinition.set(null);
    this.successKey.set(null);
    this.resetForm();
    this.drawerOpen.set(true);
  }

  protected openEditDrawer(definition: EmployeeFieldDefinition): void {
    this.editingDefinition.set(definition);
    this.successKey.set(null);
    this.resetForm(definition);
    this.drawerOpen.set(true);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
    this.editingDefinition.set(null);
    this.resetForm();
  }

  protected onDataTypeChange(): void {
    if (this.isOptionType(this.form.controls.dataType.value)) {
      if (this.optionGroups.length === 0) {
        this.addOption();
      }
    } else {
      while (this.optionGroups.length > 0) {
        this.optionGroups.removeAt(0);
      }
    }
  }

  protected addOption(): void {
    this.optionGroups.push(this.buildOptionGroup());
  }

  protected removeOption(index: number): void {
    if (index < 0 || index >= this.optionGroups.length) {
      return;
    }
    this.optionGroups.removeAt(index);
  }

  protected saveDefinition(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorKey.set(null);

    const formValue = this.form.getRawValue();
    const payload: EmployeeFieldDefinitionRequest = {
      fieldKey: formValue.fieldKey.trim(),
      displayName: formValue.displayName.trim(),
      dataType: formValue.dataType,
      isRequired: formValue.isRequired,
      category: formValue.category.trim() || 'Custom',
      sortOrder: Number(formValue.sortOrder) || 0,
      isActive: formValue.isActive,
      description: formValue.description?.trim() || null,
      options: this.isOptionType(formValue.dataType)
        ? this.optionGroups.controls
            .map((group) => ({
              label: group.controls.label.value.trim(),
              value: group.controls.value.value.trim() || null,
              sortOrder: Number(group.controls.sortOrder.value) || 0
            }))
            .filter((option) => option.label.length > 0)
        : []
    };

    const editing = this.editingDefinition();
    const request$ = editing
      ? this.actionsService.updateFieldDefinition(editing.id, payload)
      : this.actionsService.createFieldDefinition(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.submitting.set(false);
        this.drawerOpen.set(false);
        this.editingDefinition.set(null);
        this.resetForm();
        this.successKey.set(
          editing
            ? 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.MESSAGES.UPDATED'
            : 'PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.MESSAGES.CREATED'
        );
        this.loadDefinitions();
      },
      error: (error) => {
        const message = error?.error?.message as string | undefined;
        switch (message) {
          case 'FIELD_KEY_EXISTS':
            this.errorKey.set('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ERRORS.FIELD_KEY_EXISTS');
            break;
          case 'FIELD_KEY_REQUIRED':
            this.errorKey.set('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.ERRORS.FIELD_KEY_REQUIRED');
            break;
          default:
            this.errorKey.set('COMMON.ERROR.ACTION_FAILED');
            break;
        }
        this.submitting.set(false);
      }
    });
  }

  protected confirmDelete(definition: EmployeeFieldDefinition): void {
    const message = this.translate.instant('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.CONFIRM_DELETE', {
      name: definition.displayName
    });

    if (!window.confirm(message)) {
      return;
    }

    this.successKey.set(null);
    this.errorKey.set(null);

    this.actionsService
      .deleteFieldDefinition(definition.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.successKey.set('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.MESSAGES.DELETED');
          this.loadDefinitions();
        },
        error: () => {
          this.errorKey.set('COMMON.ERROR.ACTION_FAILED');
        }
      });
  }

  private loadDefinitions(): void {
    this.loading.set(true);
    this.actionsService
      .getFieldDefinitions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (definitions) => {
          const ordered = [...definitions].sort((a, b) => {
            if (a.sortOrder === b.sortOrder) {
              return a.displayName.localeCompare(b.displayName);
            }
            return a.sortOrder - b.sortOrder;
          });
          this.fieldDefinitions.set(ordered);
          this.loading.set(false);
        },
        error: () => {
          this.errorKey.set('PAGES.EMPLOYEE_RECORDS.FIELD_CONFIG.MESSAGES.LOAD_FAILED');
          this.loading.set(false);
        }
      });
  }

  private resetForm(definition?: EmployeeFieldDefinition | null): void {
    const targetSortOrder = definition?.sortOrder ?? this.nextSortOrder();

    this.form.reset({
      fieldKey: definition?.fieldKey ?? '',
      displayName: definition?.displayName ?? '',
      dataType: definition?.dataType ?? 'text',
      category: definition?.category ?? 'Personal',
      isRequired: definition?.isRequired ?? true,
      isActive: definition?.isActive ?? true,
      sortOrder: targetSortOrder,
      description: definition?.description ?? ''
    });

    while (this.optionGroups.length > 0) {
      this.optionGroups.removeAt(0);
    }

    if (definition && this.isOptionType(definition.dataType) && definition.options.length > 0) {
      definition.options
        .slice()
        .sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.label.localeCompare(b.label);
          }
          return a.sortOrder - b.sortOrder;
        })
        .forEach((option) => this.optionGroups.push(this.buildOptionGroup(option)));
    }

    this.onDataTypeChange();
    this.form.markAsPristine();
  }

  private nextSortOrder(): number {
    const definitions = this.fieldDefinitions();
    if (definitions.length === 0) {
      return 0;
    }
    return Math.max(...definitions.map((definition) => definition.sortOrder)) + 1;
  }

  private buildOptionGroup(option?: Partial<EmployeeFieldOption>): OptionFormGroup {
    return this.fb.nonNullable.group({
      label: [option?.label ?? '', [Validators.required, Validators.maxLength(128)]],
      value: [option?.value ?? '', [Validators.maxLength(128)]],
      sortOrder: [option?.sortOrder ?? this.optionGroups.length + 1, [Validators.min(0)]]
    }) as OptionFormGroup;
  }
}
