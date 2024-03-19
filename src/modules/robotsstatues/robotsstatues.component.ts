import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild, WritableSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSegmentedComponent, NzSegmentedOption } from 'ng-zorro-antd/segmented';
import { Area, AreaService } from '../../app/services/area.service';
import { Droid, DroidService } from '../../app/services/droid.service';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Hls from 'hls.js';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableFilterList, NzTableModule, NzTableSize } from 'ng-zorro-antd/table';
import { GetDataService, RandomUser, RobotGet } from '../../app/services/getdata.service';
import { HkIpcService } from '../../app/services/hkipc.service';
import { InteractionService } from '../../app/services/interaction.service';
import { environment } from '../../environments/environment';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

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
        FormsModule,
        NzDatePickerModule,
    ],
    standalone: true,
    selector: 'mre-overview',
    templateUrl: './robotsstatues.component.html',
    styleUrl: './robotsstatues.component.scss',
})
export class RobotsstatuesComponent {

    @ViewChild('liveHolder', { read: ElementRef })
    private readonly liveHolderRef?: ElementRef<HTMLDivElement>;

    public area?: Area;

    public droids?: Array<Droid>;

    public isLive: WritableSignal<boolean | undefined> = signal<boolean | undefined>(undefined);

    public droidOptions: Array<NzSegmentedOption> = new Array<NzSegmentedOption>();

    public isVisible?: boolean = false;

    public isVisiblepic?: boolean = false;

    public total: number = 1;

    public listOfRandomUser: Array<RandomUser> = [];

    public listOfrobotGet: Array<RobotGet> = [];

    public loading: boolean = true;

    public pageSize: number = 10;

    public ageIndex: number = 1;

    public size: NzTableSize = 'small';

    public date: null = null;

    public robotId: number = 1;

    public deviceName: string = 'none';

    public filterGender: NzTableFilterList = [
        { text: 'male', value: 'male' },
        { text: 'female', value: 'female' },
    ];

    public pageIndex: number = 1;

    public modalWidth: string = 'auto';

    private liveVideoNode?: HTMLVideoElement;

    private liveHls?: Hls;

    public constructor(
        private readonly renderer: Renderer2,
        private readonly areaService: AreaService,
        private readonly droidService: DroidService,
        private readonly ipcService: HkIpcService,
        private readonly interaction: InteractionService,
        private readonly randomUserService: GetDataService,
    ) { }

    // 是
    @Input()
    private set areaId(thevalue: string) {
        if (!thevalue) { return; }
        this.disposeLive();
        const value: Array<string> = thevalue.split('|');
        this.area = this.areaService.getById(value[0]) ?? undefined;
        this.droids = this.droidService.getByArea(value[0]);

        if (Array.isArray(this.droids) && this.droids.length > 0) {
            this.droidOptions = this.droids.map<NzSegmentedOption>(i => ({ label: i.name, value: i.id, icon: 'video-camera' }));
            this.robotId = Number(value[1]);
            this.getDevice();
        } else {
            this.droidOptions = new Array<NzSegmentedOption>();
        }
    }

    public showModal(deviceName: string): void {
        this.isVisible = true;
        this.deviceName = deviceName;
        this.loadDataFromServer(this.robotId, deviceName, []);
    }

    public handleCancel(): void {
        this.isVisible = false;
    }

    public showModapic(): void {
        this.isVisiblepic = true;
    }

    public handleCancelpic(): void {
        this.isVisiblepic = false;
    }

    public showPic(path: string): void {
        window.open(`${environment.apiUrl}/${path}`, '_blank');
    }

    public getDevice(): void {
        this.loading = true;
        this.randomUserService.getButtoneed(this.robotId).subscribe(data => {
            this.loading = false;
            this.total = 200;
            data.data.forEach(innerData => {
                this.createButton(innerData.name);
            });
        });
    }

    public createButton(buttonname: string): void {
        const container: HTMLElement | null = document.querySelector('.container');
        if (!container) { return; }

        // 创建一个新的按钮元素
        const button: HTMLButtonElement = document.createElement('button');

        // 设置按钮的文本为按钮名称
        button.textContent = buttonname;

        // 添加点击事件
        button.addEventListener('click', () => {
            this.showModal(buttonname);
        });

        // 将按钮添加到容器中
        container.append(button);
    }

    // 1
    public loadDataFromServer(
        robotId: number,
        deviceName: string,
        startendTime: Array<Date>,
    ): void {
        this.loading = true;
        this.randomUserService.getUsers(robotId, deviceName, startendTime).subscribe(data => {
            this.loading = false;
            this.total = 200;
            this.listOfRandomUser = data.data;
        });
    }

    public onChange(result: Array<Date>): void {
        this.loadDataFromServer(this.robotId, this.deviceName, result);
    }

    public doCheck(): void {
        this.loadDataFromServer(this.robotId, this.deviceName, this.getDates());
    }

    public getDates(): Array<Date> {
        const currentDate: Date = new Date();
        const pastDate: Date = new Date(currentDate);
        pastDate.setHours(currentDate.getHours() - 24);
        return [pastDate, currentDate];
    }

    public async onLiveClick(): Promise<void> {
        if (typeof this.robotId != 'number') { return; }
        const droid: Droid | undefined = this.droids?.[this.robotId - 1];
        if (droid?.ipcId) {
            this.disposeLive();
            this.isLive.set(false);
            await this.loadLive(droid.ipcId);
        } else {
            await this.interaction.toast('没有找到当前机器人相关的摄像头信息');
        }
    }

    public async onSelectDroid(index: number): Promise<void> {
        this.robotId = index;
        if (this.isLive() ?? false) {
            this.disposeLive();
            await this.onLiveClick();
        }
    }

    public async onIpcControl(action: 'up' | 'down' | 'left' | 'right'): Promise<void> {
        if (typeof this.robotId != 'number') { return; }
        const droid: Droid | undefined = this.droids?.[this.robotId - 1];
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
        if (typeof this.robotId != 'number') { return; }
        const droid: Droid | undefined = this.droids?.[this.robotId];
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
