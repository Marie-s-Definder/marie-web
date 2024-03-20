import { Component, ElementRef, Input, Renderer2, ViewChild, WritableSignal, signal, OnInit } from '@angular/core';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzSegmentedComponent, NzSegmentedOption } from 'ng-zorro-antd/segmented';
import { Area, AreaService } from '../../app/services/area.service';
import { Droid, DroidService } from '../../app/services/droid.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Hls from 'hls.js';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { HkIpcService } from '../../app/services/hkipc.service';
import { GetRobotStatusService, RandomUser } from '../../app/services/getrobotstatus.service';
import { InteractionService } from '../../app/services/interaction.service';

// import { environment } from '../../environments/environment';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { NzTableModule, NzTableSize } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';

@Component({
    imports: [
        NzCardComponent,
        NzSegmentedComponent,
        NzIconDirective,
        NzButtonComponent,
        NzModalModule,
        CommonModule,
        NzTableModule,
        NzDropDownModule,
    ],
    standalone: true,
    selector: 'mre-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
})

export class OverviewComponent implements OnInit {

    @ViewChild('liveHolder', { read: ElementRef })
    private readonly liveHolderRef?: ElementRef<HTMLDivElement>;

    public area?: Area;

    public droids?: Array<Droid>;

    public isLive: WritableSignal<boolean | undefined> = signal<boolean | undefined>(undefined);

    public droidOptions: Array<NzSegmentedOption> = new Array<NzSegmentedOption>();

    public isVisible?: boolean = false;

    public total: number = 1;

    public droid: Droid | undefined;

    public listOfRandomUser: Array<RandomUser> = [];

    public loading: boolean = true;

    public pageSize: number = 10;

    public ageIndex: number = 1;

    public size: NzTableSize = 'small';

    public value?: string;

    public pageIndex: number = 1;

    public displayText: string = '';

    private selectedDroidIndex: number = 1;

    private liveVideoNode?: HTMLVideoElement;

    private liveHls?: Hls;

    public constructor(
        private readonly renderer: Renderer2,
        private readonly areaService: AreaService,
        private readonly droidService: DroidService,
        private readonly ipcService: HkIpcService,
        private readonly interaction: InteractionService,
        private readonly randomUserService: GetRobotStatusService,
        private readonly router: Router,
    ) { }

    @Input()
    private set areaId(value: string) {
        this.value = value;
        if (!value) { return; }
        this.disposeLive();
        this.area = this.areaService.getById(value) ?? undefined;
        this.droids = this.droidService.getByArea(value);

        if (Array.isArray(this.droids) && this.droids.length > 0) {
            this.droidOptions = this.droids.map<NzSegmentedOption>(i => ({ label: i.name, value: i.id, icon: 'video-camera' }));
            this.selectedDroidIndex = 1;
        } else {
            this.droidOptions = new Array<NzSegmentedOption>();
        }
        void this.onLiveClick();
    }

    // 对于buildingname和roomname首先传进来是007011，我需要分割为007和011，然后roomname直接就是area.name，然后看007，想办法去掉前面的0得到7然后找到areaservice里面id为7对应的name
    public loadDataFromServer(
        buildingname: string | null,
        roomname: string | undefined,
    ): void {
        this.loading = true;
        this.randomUserService.getUsers(buildingname, roomname).subscribe(data => {
            this.loading = false;
            this.total = 200;
            this.listOfRandomUser = data.data;
            this.changename(this.listOfRandomUser[0].name, this.listOfRandomUser[0].id);
        });
    }

    public changename(text: string, id: number): void {
        this.displayText = text;
        this.selectedDroidIndex = id;
    }

    public ngOnInit(): void {
        const front: string | undefined = this.value?.slice(0, 3).replace(/^0+/u, '');
        if (!front) { return; }
        const buildingname: string | null = this.areaService.findNameById(front);
        const roomname: string | undefined = this.area?.name;
        this.loadDataFromServer(buildingname, roomname);
    }

    public async onLiveClick(): Promise<void> {
        if (typeof this.selectedDroidIndex != 'number') { return; }
        this.droid = this.droids?.[this.selectedDroidIndex - 1];
        if (this.droid?.ipcId) {
            this.disposeLive();
            this.isLive.set(false);
            await this.loadLive(this.droid.ipcId);
        } else {
            await this.interaction.toast('没有找到当前机器人相关的摄像头信息');
        }
    }

    // changeOption作用一样
    public async change2handelmode(robotid: number): Promise<void> {
        const value: string = `${this.value}|${robotid.toString()}`;
        await this.router.navigate(['/robotsstatues', value]);
    }

    public async changeOption(idipc: number, name: string): Promise<void> {
        this.droid = this.droids?.[this.selectedDroidIndex - 1];
        const choosedid: number = idipc;
        this.selectedDroidIndex = choosedid;
        this.displayText = name;
        await this.onLiveClick();
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
