import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  { 
    path: 'api-tester', 
    loadComponent: () => import('./components/api-tester/api-tester').then(m => m.ApiTesterComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];