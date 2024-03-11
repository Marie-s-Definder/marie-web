import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
        }));

        return res.ok ? res.data : '';
    }

    public async snapshot(id: string): Promise<string> {
        await this.interaction.toast('努力截图中...', { type: 'loading' });
        const res: ApiResult<string> = await firstValueFrom(this.http.get<ApiResult<string>>(`${environment.apiUrl}/hkipc/snapshot`, {
            params: { id },
        }));
        if (res.ok) {
            await this.interaction.toast('截图成功');
            return res.data;
        }
        await this.interaction.toast(`截图失败 ${res.data}`);
        return '';
    }

    public async pan(id: string, direction: 'left' | 'right'): Promise<void> {
        await this.interaction.toast('努力移动中...', { type: 'loading' });
        await firstValueFrom(this.http.get(`${environment.apiUrl}/hkipc/pan`, {
            params: { id, direction },
        }));

        await this.interaction.toast('移动完成');
    }

    public async tilt(id: string, direction: 'up' | 'down'): Promise<void> {
        await this.interaction.toast('努力移动中...', { type: 'loading' });
        await firstValueFrom(this.http.get(`${environment.apiUrl}/hkipc/tilt`, {
            params: { id, direction },
        }));

        await this.interaction.toast('移动完成');
    }

}
