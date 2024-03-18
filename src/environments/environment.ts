import { Environment } from '../app/models/environment.model';

export const environment: Environment = {
    // apiUrl: 'http://localhost:8080',
    apiUrl: 'http://192.168.110.250:8080',
    getrobotstatusurl: 'http://192.168.110.250:8080/hkipc/queryRobot',
    getdatastatusurl: 'http://192.168.110.250:8080/hkipc/queryAllData',
};
