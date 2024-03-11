import { Component, ElementRef, Input, Renderer2, ViewChild, WritableSignal, signal } from '@angular/core';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzSegmentedComponent, NzSegmentedOption } from 'ng-zorro-antd/segmented';
import { Area, AreaService } from '../../app/services/area.service';
import { Droid, DroidService } from '../../app/services/droid.service';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Hls from 'hls.js';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { HkIpcService } from '../../app/services/hkipc.service';
import { InteractionService } from '../../app/services/interaction.service';
import { environment } from '../../environments/environment';

@Component({
    imports: [
        NzCardComponent,
        NzSegmentedComponent,
        NzIconDirective,
        NzButtonComponent,
    ],
    standalone: true,
    selector: 'mre-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
})
export class OverviewComponent {

    @ViewChild('liveHolder', { read: ElementRef })
    private readonly liveHolderRef?: ElementRef<HTMLDivElement>;

    public area?: Area;

    public droids?: Array<Droid>;

    public isLive: WritableSignal<boolean | undefined> = signal<boolean | undefined>(undefined);

    public droidOptions: Array<NzSegmentedOption> = new Array<NzSegmentedOption>();

    private selectedDroidIndex?: number;

    private liveVideoNode?: HTMLVideoElement;

    private liveHls?: Hls;

    public constructor(
        private readonly renderer: Renderer2,
        private readonly areaService: AreaService,
        private readonly droidService: DroidService,
        private readonly ipcService: HkIpcService,
        private readonly interaction: InteractionService,
    ) { }

    @Input()
    private set areaId(value: string) {
        if (!value) { return; }
        this.disposeLive();
        this.area = this.areaService.getById(value) ?? undefined;
        this.droids = this.droidService.getByArea(value);
        if (Array.isArray(this.droids) && this.droids.length > 0) {
            this.droidOptions = this.droids.map<NzSegmentedOption>(i => ({ label: i.name, value: i.id, icon: 'video-camera' }));
            this.selectedDroidIndex = 0;
        } else {
            this.droidOptions = new Array<NzSegmentedOption>();
        }
    }

    public async onLiveClick(): Promise<void> {
        if (typeof this.selectedDroidIndex != 'number') { return; }
        const droid: Droid | undefined = this.droids?.[this.selectedDroidIndex];
        if (droid?.ipcId) {
            this.disposeLive();
            this.isLive.set(false);
            await this.loadLive(droid.ipcId);
        } else {
            await this.interaction.toast('没有找到当前机器人相关的摄像头信息');
        }
    }

    public async onSelectDroid(index: number): Promise<void> {
        this.selectedDroidIndex = index;
        if (this.isLive() ?? false) {
            this.disposeLive();
            await this.onLiveClick();
        }
    }

    public async onIpcControl(action: 'up' | 'down' | 'left' | 'right'): Promise<void> {
        if (typeof this.selectedDroidIndex != 'number') { return; }
        const droid: Droid | undefined = this.droids?.[this.selectedDroidIndex];
        if (droid?.ipcId) {
            switch (action) {
                case 'up':
                    await this.ipcService.tilt(droid.ipcId, 'up');
                    break;
                case 'down':
                    await this.ipcService.tilt(droid.ipcId, 'down');
                    break;
                case 'left':
                    await this.ipcService.pan(droid.ipcId, 'left');
                    break;
                case 'right':
                    await this.ipcService.pan(droid.ipcId, 'right');
                    break;
                default:
                    break;
            }
        }
    }

    public async onSnapshot(): Promise<void> {
        if (typeof this.selectedDroidIndex != 'number') { return; }
        const droid: Droid | undefined = this.droids?.[this.selectedDroidIndex];
        if (droid?.ipcId) {
            const res: string = await this.ipcService.snapshot(droid.ipcId);
            if (res) {
                window.open(`${environment.apiUrl}/${res}`, '_blank');
            }
        }
    }

    private async loadLive(ipcId: string): Promise<void> {
        const liveUrl: string = await this.ipcService.getLiveUrl(ipcId);
        if (!liveUrl) {
            this.isLive.set(undefined);
            await this.interaction.toast('获取当前摄像头实时监控失败');
            return;
        }

        this.liveVideoNode = document.createElement('video');

        this.liveHls = new Hls();
        this.liveHls.loadSource(liveUrl);
        this.liveHls.attachMedia(this.liveVideoNode);
        this.liveVideoNode.autoplay = true;
        this.liveVideoNode.muted = true;
        this.liveHls.once(Hls.Events.MANIFEST_LOADED, () => {
            this.renderer.appendChild(this.liveHolderRef?.nativeElement, this.liveVideoNode);
            this.isLive.set(true);
        });
    }

    private disposeLive(): void {
        this.liveVideoNode?.remove();
        this.liveHls?.destroy();
        this.isLive.set(undefined);
    }

}
