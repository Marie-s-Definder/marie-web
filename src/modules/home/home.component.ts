import { Component } from '@angular/core';
import { NzCommentComponent, NzCommentAvatarDirective, NzCommentContentDirective } from 'ng-zorro-antd/comment';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';

@Component({
    imports: [
        NzAvatarComponent,
        NzCommentAvatarDirective,
        NzCommentComponent,
        NzCommentContentDirective,
    ],
    selector: 'mre-home',
    standalone: true,
    styleUrl: './home.component.scss',
    templateUrl: './home.component.html',
})

export class HomeComponent { }
