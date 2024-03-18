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
        name: '1号楼',
        icon: 'mobile',
        children: [{
            id: '001001',
            name: '中央空调机房',
            icon: 'database',
        }, {
            id: '001002',
            name: '综合机房',
        }, {
            id: '001003',
            name: '真空泵房/空压机房',
        }, {
            id: '001004',
            name: '风机房',
            icon: 'heat-map',
        }, {
            id: '001005',
            name: '楼层井道',
        }],
    }, {
        id: '2',
        name: '2、3号楼',
        children: [{
            id: '002001',
            name: '热交换',
        }, {
            id: '002002',
            name: '生活水泵房',
        }, {
            id: '002003',
            name: '真空泵房',
        }, {
            id: '002004',
            name: '配电间',
        }],
    }, {
        id: '3',
        name: '5号楼',
        children: [{
            id: '003001',
            name: '中央空调机房',
        }, {
            id: '003002',
            name: '生活水泵房',
        }, {
            id: '003003',
            name: '真空泵房',
        }, {
            id: '003004',
            name: '综合泵房',
        }, {
            id: '003005',
            name: '风机房',
        }, {
            id: '003006',
            name: '配电间',
        }, {
            id: '003007',
            name: '锅炉房',
        }],
    }, {
        id: '4',
        name: '6号楼',
        children: [{
            id: '004001',
            name: 'B1热交换',
        }, {
            id: '004002',
            name: '生活水泵房',
        }, {
            id: '004003',
            name: '西真空泵房',
        }, {
            id: '004004',
            name: '东真空泵房',
        }, {
            id: '004005',
            name: '配电间',
        }, {
            id: '004006',
            name: '屋面热交换',
        }, {
            id: '004007',
            name: '锅炉房',
        }],
    }, {
        id: '5',
        name: '8号楼',
        children: [{
            id: '005001',
            name: '生活水泵房',
        }, {
            id: '005002',
            name: '配电间',
        }],
    }, {
        id: '6',
        name: '9号楼',
        children: [{
            id: '006001',
            name: '浴水机房',
        }, {
            id: '006002',
            name: '真空泵房',
        }, {
            id: '006003',
            name: '风机房',
        }, {
            id: '006004',
            name: '配电间',
        }],
    }, {
        id: '7',
        name: '10号楼',
        children: [{
            id: '007001',
            name: '中央空调机房',
        }, {
            id: '007002',
            name: '生活水泵房',
        }, {
            id: '007003',
            name: '热交换机房',
        }, {
            id: '007004',
            name: '锅炉房',
        }, {
            id: '007005',
            name: '真空泵房',
        }, {
            id: '007006',
            name: '空压机房',
        }, {
            id: '007007',
            name: '风机房',
        }, {
            id: '007008',
            name: '楼层井道',
        }, {
            id: '007009',
            name: '屋面',
        }, {
            id: '007010',
            name: 'UPS机房',
        }, {
            id: '007011',
            name: '夹层',
        }],
    }, {
        id: '8',
        name: '11号楼',
        children: [{
            id: '008001',
            name: '生活水泵房',
        }, {
            id: '008002',
            name: '风机房',
        }, {
            id: '008003',
            name: '楼层井道',
        }],
    }, {
        id: '9',
        name: '12号楼',
        children: [{
            id: '009001',
            name: '风机房',
        }, {
            id: '009002',
            name: '配电间',
        }, {
            id: '009003',
            name: '污水井',
        }],
    }, {
        id: '10',
        name: '35号楼',
        children: [{
            id: '010001',
            name: '35号楼',
        }],
    }, {
        id: '11',
        name: '36号楼',
        children: [{
            id: '011001',
            name: '中央空调机房',
        }, {
            id: '011002',
            name: '生活水泵房',
        }, {
            id: '011003',
            name: '真空泵房',
        }, {
            id: '011004',
            name: '浴水机房',
        }, {
            id: '011005',
            name: '风机房',
        }, {
            id: '011006',
            name: '配电间',
        }],
    }, {
        id: '12',
        name: '老门诊',
        children: [{
            id: '012001',
            name: '东新风机房',
        }, {
            id: '012002',
            name: '西新风机房',
        }, {
            id: '012003',
            name: '北水汀机房',
        }, {
            id: '012004',
            name: '南水汀机房',
        }, {
            id: '012005',
            name: '真空泵房',
        }, {
            id: '012006',
            name: '生活水泵房',
        }, {
            id: '012007',
            name: '浴水机房',
        }, {
            id: '012008',
            name: '配电间',
        }],
    }, {
        id: '13',
        name: '锅炉房',
        children: [{
            id: '013001',
            name: '锅炉房',
        }],
    }, {
        id: '14',
        name: '氧气间',
        children: [{
            id: '014001',
            name: '氧气间',
        }],
    }, {
        id: '15',
        name: '徐家汇分院',
        children: [{
            id: '015001',
            name: '中央空调机房',
        }, {
            id: '015002',
            name: '锅炉房',
        }, {
            id: '015003',
            name: '淋雨热交换机房',
        }, {
            id: '015004',
            name: '采暖热交换机房',
        }, {
            id: '015005',
            name: '生活水泵房',
        }, {
            id: '015006',
            name: '配电间',
        }],
    }, {
        id: '16',
        name: '小木桥',
        children: [{
            id: '016001',
            name: '锅炉房',
        }, {
            id: '016002',
            name: '热交换机房',
        }, {
            id: '016003',
            name: '生活水泵房',
        }, {
            id: '016004',
            name: '污水泵房',
        }, {
            id: '016005',
            name: '配电间',
        }],
    }, {
        id: '17',
        name: '局门路',
        children: [{
            id: '017001',
            name: '配电间',
        }],
    }, {
        id: '18',
        name: '远洋院区',
        children: [{
            id: '018001',
            name: '中央空调机房',
        }, {
            id: '018002',
            name: '真空泵房',
        }, {
            id: '018003',
            name: '生活水泵房',
        }, {
            id: '018004',
            name: '污水泵房',
        }, {
            id: '018005',
            name: '配电间',
        }],
    }, {
        id: '19',
        name: '监控室',
        children: [{
            id: '019001',
            name: '监控室',
        }],
    }];

    public getList(): Array<Area> {
        return this.areas;
    }

    public getById(id: string): Area | null {
        return this.areas.flatMap(i => i.children).find(i => i?.id == id) ?? null;
    }

}
