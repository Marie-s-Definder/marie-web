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
import { NzTableModule, NzTableSize } from 'ng-zorro-antd/table';
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

    public pageIndex: number = 1;

    public modalWidth: string = 'auto';

    public picpath: string = '';

    public widthnz: string = '60%';

    public picwidth: string = 'auto';

    public picheight: string = 'auto';

    public imageWidth: string = '100%';

    public imageHeight: string = '100%';

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
        void this.onLiveClick();
    }

    public showModal(deviceName: string): void {
        this.isVisible = true;
        this.deviceName = deviceName;
        this.loadDataFromServer(this.robotId, this.deviceName, []);
    }

    public returnback(): void {
        this.loadDataFromServer(this.robotId, this.deviceName, []);
    }

    public handleCancel(): void {
        this.isVisible = false;
    }

    public getPath(): string {
        return `${environment.apiUrl}/${this.picpath}`;
    }

    public handleCancelpic(): void {
        this.isVisiblepic = false;
    }

    public showPic(path: string): void {
        this.isVisiblepic = true;
        this.picpath = path;
    }

    public getDevice(): void {
        this.loading = true;
        this.randomUserService.getButtoneed(this.robotId).subscribe(data => {
            this.loading = false;
            this.total = 200;
            data.data.forEach(innerData => {
                this.createButton(innerData.name, innerData.status);
            });
        });
    }

    public createButton(buttonname: string, status: number): void {
        const container: HTMLElement | null = document.querySelector('.container');
        if (!container) { return; }

        // 创建一个新的按钮元素
        const button: HTMLButtonElement = document.createElement('button');

        const stat: string = status == 0 ? '正常' : '异常';

        const chineseSpan: HTMLSpanElement = document.createElement('span');
        chineseSpan.style.display = 'inline-block';
        chineseSpan.style.margin = '0 0 0 0 px';
        chineseSpan.style.padding = '0 px';
        chineseSpan.textContent = `${stat}`;
        button.style.padding = '0';
        button.style.paddingLeft = '5px';
        const color1: string = 'rgb(96, 241, 96)';
        const color2: string = 'red';

        if (status == 0) {
            chineseSpan.style.backgroundColor = color1;
            chineseSpan.style.border = `5px solid ${color1}`;
            button.style.border = `2px solid ${color1}`;
        } else if (status == 1) {
            chineseSpan.style.backgroundColor = color2;
            chineseSpan.style.border = `5px solid ${color2}`;
            button.style.border = `2px solid ${color2}`;
        }

        button.textContent = buttonname;

        button.addEventListener('click', () => {
            this.showModal(`${buttonname}`);
        });

        button.append(chineseSpan);
        container.append(button);
    }

    public calculateMaxWidth(): number {
        return window.innerWidth * 0.7;
    }

    // 计算最大高度
    public calculateMaxHeight(): number {
        // 根据比例计算出最大高度
        return window.innerHeight * 0.5;
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

    public doCheck(type: string): void {
        const currentDate: Date = new Date();
        const pastDate: Date = new Date(currentDate);
        if (type == 'a') {
            pastDate.setHours(currentDate.getHours() - 24);
        } else if (type == 'b') {
            pastDate.setHours(currentDate.getHours() - 24 * 7);
        } else if (type == 'c') {
            pastDate.setHours(currentDate.getHours() - 24 * 31);
        }
        this.loadDataFromServer(this.robotId, this.deviceName, [pastDate, currentDate]);
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
        const droid: Droid | undefined = this.droids?.[this.robotId - 1];
        if (droid?.ipcId) {
            const res: string = await this.ipcService.snapshot(droid.ipcId);
            if (res) {
                this.showPic(res);
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
