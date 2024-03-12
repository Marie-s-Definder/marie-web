import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResult } from '../models/api-result.model';
import { InteractionService } from './interaction.service';

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable({ providedIn: null })
export class HkIpcService {

    public constructor(
        private readonly http: HttpClient,
        private readonly interaction: InteractionService,
    ) { }

    public async getLiveUrl(id: string): Promise<string> {
        const res: ApiResult<string> = await firstValueFrom(this.http.get<ApiResult<string>>(`${environment.apiUrl}/hkipc/liveUrl`, {
            params: { id },
        }).pipe(
            catchError(() => of({ ok: false, data: '' })),
        ));

        return res.ok ? res.data : '';
    }

    public async snapshot(id: string): Promise<string> {
        await this.interaction.toast('努力截图中...', { type: 'loading' });
        const res: ApiResult<string> = await firstValueFrom(this.http.get<ApiResult<string>>(`${environment.apiUrl}/hkipc/snapshot`, {
            params: { id },
        }).pipe(
            catchError(() => of({ ok: false, data: '' })),
        ));
        if (res.ok) {
            await this.interaction.toast('截图成功');
            return res.data;
        }
        await this.interaction.toast(`截图失败 ${res.data}`);
        return '';
    }

    public async pan(id: string, direction: 'left' | 'right'): Promise<void> {
        await this.interaction.toast('努力移动中...', { type: 'loading' });
        const res: ApiResult<string> = await firstValueFrom(this.http.get<ApiResult<string>>(`${environment.apiUrl}/hkipc/pan`, {
            params: { id, direction },
        }).pipe(
            catchError(() => of({ ok: false, data: '' })),
        ));

        await this.interaction.toast(res.ok ? '移动完成' : '移动未完成');
    }

    public async tilt(id: string, direction: 'up' | 'down'): Promise<void> {
        await this.interaction.toast('努力移动中...', { type: 'loading' });
        const res: ApiResult<string> = await firstValueFrom(this.http.get<ApiResult<string>>(`${environment.apiUrl}/hkipc/tilt`, {
            params: { id, direction },
        }).pipe(
            catchError(() => of({ ok: false, data: '' })),
        ));
        await this.interaction.toast(res.ok ? '移动完成' : '移动未完成');
    }

}
