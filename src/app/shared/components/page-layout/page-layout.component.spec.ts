import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { PageLayoutComponent } from './page-layout.component';
import { PageDataService, PageDataResponse } from '../../../core/services/page-data.service';

describe('PageLayoutComponent', () => {
  let fixture: ComponentFixture<PageLayoutComponent>;
  let component: PageLayoutComponent;
  let pageDataService: jasmine.SpyObj<PageDataService>;
  let translate: TranslateService;

  beforeEach(async () => {
    pageDataService = jasmine.createSpyObj<PageDataService>('PageDataService', ['getPageData']);

    await TestBed.configureTestingModule({
      imports: [
        PageLayoutComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [{ provide: PageDataService, useValue: pageDataService }]
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.setTranslation(
      'en',
      {
        TITLE: 'Employees',
        CONTENT: 'Employee List',
        TODO: 'No data yet',
        PAGES: {
          NOTE: {
            KEY: 'Live data is now connected'
          }
        },
        COMMON: {
          SECTIONS: { FILTERS: 'Filters' },
          ACTIONS: {
            RESET_FILTERS: 'Reset filters',
            EXPORT: 'Export',
            APPLY_FILTERS: 'Apply filters'
          },
          SELECT: {
            PLACEHOLDER: 'Please select'
          },
          TABLE: {
            ACTIONS: 'Actions',
            NO_DATA: 'No records available yet',
            TOTAL_RECORDS: 'Total: {{count}} records'
          },
          PAGINATION: {
            PAGE_SIZE: 'Rows per page',
            RANGE: 'Showing {{start}}-{{end}} of {{total}}',
            PREV: 'Previous',
            NEXT: 'Next'
          }
        }
      },
      true
    );
    translate.use('en');

    fixture = TestBed.createComponent(PageLayoutComponent);
    component = fixture.componentInstance;
  });

  it('renders total count badge and backend note from live data', () => {
    const response: PageDataResponse = {
      module: 'employee-records',
      page: 'all',
      pageNumber: 1,
      pageSize: 20,
      totalCount: 3,
      rows: [
        {
          columns: { COLUMN_ONE: 'Value' }
        }
      ],
      noteKey: 'PAGES.NOTE.KEY'
    };

    pageDataService.getPageData.and.returnValue(of(response));

    component.pageTitleKey = 'TITLE';
    component.contentTitleKey = 'CONTENT';
    component.todoKey = 'TODO';
    component.tableHeaderKeys = ['COLUMN_ONE'];
    component.moduleKey = 'employee-records';
    component.pageKey = 'all';

    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('[data-testid="total-count-badge"]') as HTMLElement | null;
    expect(badge).withContext('total badge is rendered').not.toBeNull();
    expect(badge?.textContent).toContain('3');

    const note = fixture.nativeElement.querySelector('[data-testid="backend-note"]') as HTMLElement | null;
    expect(note).withContext('backend note is rendered').not.toBeNull();
    expect(note?.textContent).toContain('Live data is now connected');
  });
});
