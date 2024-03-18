import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RandomUser {
    id: string;
    robotId: string;
    deviceName: string;
    date: string;
    name: string;
    result: string;
    status: string;
    imgPath: string;
}

@Injectable({ providedIn: 'root' })
export class GetDataService {

    // private readonly http: HttpClient;
    public constructor(private readonly http: HttpClient) {}

    public getUsers(
        robotid: string,
        deviceName: string,
        startendTime: Array<Date>,
    ): Observable<{ data: Array<RandomUser> }> {
        const params: HttpParams = new HttpParams()
            .append('robotid', `${robotid}`)
            .append('deviceName', `${deviceName}`)
            .append('startTime', `${startendTime[0].toISOString()}`)
            .append('endTime', `${startendTime[1].toISOString()}`);
        return this.http
            .get<{ data: Array<RandomUser> }>(`${environment.getdatastatusurl}`, { params })
            .pipe(catchError(() => of({ data: [] })));
    }

}
