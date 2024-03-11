import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '404',
    loadComponent: async () => import('./components/404/notfound.component').then(i => i.NotFoundComponent),
}, {
    path: '',
    loadComponent: async () => import('../modules/home/home.component').then(i => i.HomeComponent),
}, {
    path: 'overview/:areaId',
    loadComponent: async () => import('../modules/overview/overview.component').then(i => i.OverviewComponent),
}];
