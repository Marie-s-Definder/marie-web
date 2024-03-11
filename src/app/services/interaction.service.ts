import { ChangeDetectionStrategy, Component, Inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';

interface PromptModalParam {
    message?: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, NzInputDirective],
    selector: 'adm-nz-prompt-modal',
    standalone: true,
    styles: [],
    template: '<p [innerHTML]="modalData.message"></p><input [attr.cdkFocusInitial]="true" nz-input [(ngModel)]="result">',
})
export class NzPromptModalComponent {

    public result: string | null = null;

    public constructor(
        @Inject(NZ_MODAL_DATA) public readonly modalData: PromptModalParam,
    ) { }

}

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable({ providedIn: null })
export class InteractionService {

    public constructor(
        private readonly nzModal: NzModalService,
        private readonly nzMessage: NzMessageService,
    ) { }

    public async toast(message: string, { type = undefined, duration = 1800 }: { type?: 'success' | 'info' | 'warning' | 'error' | 'loading'; duration?: number } = {}): Promise<void> {
        return new Promise<void>(resolve => {
            this.nzMessage.create(type ?? 'info', message, { nzDuration: duration });
            resolve();
        });
    }

    public async alert(title: string, { message = '', okText = '确定' }: { message?: string; okText?: string } = {}): Promise<void> {
        return new Promise<void>(resolve => {
            this.nzModal.info({
                nzTitle: title,
                nzContent: message,
                nzCloseIcon: '',
                nzOkText: okText || '确定',
                nzOnOk: () => resolve(),
            });
        });
    }

    public async confirm(title: string, { message = '', okText = '确定' }: { message?: string; okText?: string } = {}): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.nzModal.confirm({
                nzTitle: title,
                nzContent: message,
                nzCloseIcon: '',
                nzOkText: okText || '确定',
                nzOnOk: () => resolve(true),
                nzOnCancel: () => resolve(false),
            });
        });
    }

    public async prompt(title: string, param: PromptModalParam = {}): Promise<string | null> {
        return new Promise<string | null>(resolve => {
            this.nzModal.confirm({
                nzData: param,
                nzTitle: title,
                nzContent: NzPromptModalComponent,
                nzCloseIcon: '',
                nzOnOk: (component: NzPromptModalComponent) => {
                    resolve(component.result);
                },
                nzOnCancel: () => resolve(null),
            });
        });
    }

}
