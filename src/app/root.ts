import { Component } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginComponent } from './components/login/login.component';
import { HkIpcService } from './services/hkipc.service';
import { InteractionService } from './services/interaction.service';

@Component({
    imports: [RouterOutlet],
    providers: [
        HkIpcService,
        InteractionService,
        NzModalService,
    ],
    selector: 'mre-root',
    standalone: true,
    template: '<router-outlet />',
})
export class RootComponent { }

export const routes: Routes = [{
    path: '',
    loadComponent: async () => import('./components/shell/shell.component').then(i => i.ShellComponent),
    loadChildren: async () => import('./app.routes').then(i => i.routes),
}, {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
}, {
    path: '**',
    redirectTo: '404',
}];
