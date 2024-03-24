import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzBreadCrumbComponent, NzBreadCrumbItemComponent } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzIconDirective, NzIconService } from 'ng-zorro-antd/icon';
import { NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Observable, interval, map } from 'rxjs';
import { Area, AreaService } from '../../services/area.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

// 是
@Component({
    imports: [
        AsyncPipe,
        DatePipe,
        RouterOutlet,
        RouterLink,

        NzBreadCrumbComponent,
        NzBreadCrumbItemComponent,
        NzContentComponent,
        NzDropDownDirective,
        NzDropdownMenuComponent,
        NzHeaderComponent,
        NzIconDirective,
        NzLayoutComponent,
        NzMenuModule,
        NzSiderComponent,
        NzButtonModule,

    ],
    providers: [
    ],
    selector: 'mre-shell',
    standalone: true,
    styleUrl: './shell.component.scss',
    templateUrl: './shell.component.html',
})
export class ShellComponent {

    public clock$: Observable<Date> = interval(500).pipe(map(() => new Date()));

    public areas: Array<Area> = this.areaService.getList();

    public constructor(
        private readonly nzIcon: NzIconService,
        private readonly areaService: AreaService,
    ) {
        this.nzIcon.changeAssetsSource('zorro-svg');
    }

}
