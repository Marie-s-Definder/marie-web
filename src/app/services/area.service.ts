import { Injectable } from '@angular/core';

export interface Area {
    id: string;
    name: string;
    icon?: string;
    children?: Array<Area>;
    selected?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AreaService {

    private readonly areas: Array<Area> = [{
        id: '1',
        name: '翔英大楼',
        icon: 'mobile',
        children: [{
            id: '11',
            name: '数据机房',
            icon: 'database',
        }, {
            id: '12',
            name: '空调机房',
        }, {
            id: '13',
            name: '水泵机房',
        }, {
            id: '14',
            name: '热交换机房',
            icon: 'heat-map',
        }, {
            id: '15',
            name: '通风井道',
        }],
    }, {
        id: '2',
        name: '教学大楼',
        children: [{
            id: '21',
            name: '数据机房',
        }, {
            id: '22',
            name: '空调机房',
        }, {
            id: '23',
            name: '水泵机房',
        }, {
            id: '24',
            name: '热交换机房',
        }, {
            id: '25',
            name: '通风井道',
        }],
    }, {
        id: '3',
        name: '通用试验大楼',
        children: [{
            id: '31',
            name: '数据机房',
        }, {
            id: '32',
            name: '空调机房',
        }, {
            id: '33',
            name: '水泵机房',
        }, {
            id: '34',
            name: '热交换机房',
        }, {
            id: '35',
            name: '通风井道',
        }],
    }, {
        id: '4',
        name: '图书纪念馆',
        children: [{
            id: '41',
            name: '数据机房',
        }, {
            id: '42',
            name: '空调机房',
        }, {
            id: '43',
            name: '水泵机房',
        }, {
            id: '44',
            name: '热交换机房',
        }, {
            id: '45',
            name: '通风井道',
        }],
    }, {
        id: '5',
        name: '留韵餐厅',
        children: [{
            id: '51',
            name: '数据机房',
        }, {
            id: '52',
            name: '空调机房',
        }, {
            id: '53',
            name: '水泵机房',
        }, {
            id: '54',
            name: '热交换机房',
        }, {
            id: '55',
            name: '通风井道',
        }],
    }];

    public getList(): Array<Area> {
        return this.areas;
    }

    public getById(id: string): Area | null {
        return this.areas.flatMap(i => i.children).find(i => i?.id == id) ?? null;
    }

}
