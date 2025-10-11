import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, NgIf],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroy$ = new Subject<void>();

  private readonly isDesktop = signal<boolean>(false);
  private readonly sidebarToggled = signal<boolean>(false);

  readonly isSidebarVisible = computed(
    () => this.isDesktop() || this.sidebarToggled()
  );
  readonly desktop = this.isDesktop.asReadonly();

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.destroy$))
      .subscribe(snapshot => {
        const desktop = snapshot.matches;
        this.isDesktop.set(desktop);
        if (desktop) {
          this.sidebarToggled.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleToggleRequest(): void {
    if (this.isDesktop()) {
      return;
    }
    this.sidebarToggled.update((open) => !open);
  }

  closeSidebarOnNavigate(): void {
    if (!this.isDesktop()) {
      this.sidebarToggled.set(false);
    }
  }
}
