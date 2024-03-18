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
        name: '机器人1',
        areaId: '007011',
        ipcId: '1',
    }, {
        id: '2',
        name: '机器人2',
        areaId: '007011',
        ipcId: '2',
    }, {
        id: '3',
        name: '机器人3',
        areaId: '007010',
        ipcId: '3',
    }, {
        id: '4',
        name: '机器人4',
        areaId: '007009',
    }];

    public getByArea(id: string): Array<Droid> {
        return this.droids.filter(i => i.areaId == id);
    }

}
