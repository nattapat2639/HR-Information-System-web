import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { titleKey: 'AUTH.LOGIN.TITLE' }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }
];
