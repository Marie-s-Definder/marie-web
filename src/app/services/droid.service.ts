import { Injectable } from '@angular/core';

export interface Droid {
    id: string;
    name: string;
    areaId: string;
    ipcId?: string;
}

@Injectable({ providedIn: 'root' })
export class DroidService {

    private readonly droids: Array<Droid> = [{
        id: '1',
        name: '东侧入口',
        areaId: '11',
        ipcId: '1',
    }, {
        id: '2',
        name: '西侧入口',
        areaId: '11',
        ipcId: '2',
    }, {
        id: '3',
        name: '主入口',
        areaId: '12',
        ipcId: '3',
    }, {
        id: '4',
        name: '天花板',
        areaId: '13',
    }];

    public getByArea(id: string): Array<Droid> {
        return this.droids.filter(i => i.areaId == id);
    }

}
