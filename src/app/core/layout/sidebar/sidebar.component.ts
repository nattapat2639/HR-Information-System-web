import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SIDEBAR_MENU } from '../../../config/sidebar-menu.config';
import { MenuItem } from '../../models/menu-item.model';
import { AuthContextService } from '../../services/auth-context.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'z-30 w-64 bg-white border-r border-gray-200 flex flex-col'
  }
})
export class SidebarComponent {
  private readonly authContext = inject(AuthContextService);

  @Input() isDesktop = true;
  @Output() navigate = new EventEmitter<void>();

  readonly menuItems = SIDEBAR_MENU;
  readonly openMenu = signal<string | null>(null);

  @HostBinding('class.fixed') get isFixed(): boolean {
    return !this.isDesktop;
  }

  @HostBinding('class.inset-y-0') get fullHeight(): boolean {
    return !this.isDesktop;
  }

  @HostBinding('class.left-0') get alignLeft(): boolean {
    return !this.isDesktop;
  }

  @HostBinding('class.shadow-lg') get showShadow(): boolean {
    return !this.isDesktop;
  }

  toggleMenuSection(menuKey?: string | null): void {
    if (!menuKey) {
      return;
    }
    const current = this.openMenu();
    this.openMenu.set(current === menuKey ? null : menuKey);
  }

  shouldShowMenu(item: MenuItem): boolean {
    if (item.children?.length) {
      return item.children.some((child) => this.shouldShowMenu(child));
    }

    const hasPermission =
      !item.requiredPermission || this.authContext.hasPermission(item.requiredPermission);
    if (!hasPermission) {
      return false;
    }

    if (!item.requiredRole) {
      return true;
    }

    if (Array.isArray(item.requiredRole)) {
      return item.requiredRole.some((role) => this.authContext.hasRole(role));
    }

    return this.authContext.hasRole(item.requiredRole);
  }

  handleNavigate(): void {
    this.navigate.emit();
  }
}
