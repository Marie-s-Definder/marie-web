import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface robotGet {
    id: number;
    robotId: number;
    name: string;
}

export interface RandomUser {
    id: number;
    robotId: number;
    devicename: string;
    date: string;
    name: string;
    result: string;
    status: string;
    imgpath: string;
}

@Injectable({ providedIn: 'root' })
export class GetDataService {

    // private readonly http: HttpClient;
    public constructor(private readonly http: HttpClient) { }

    public getUsers(
        robotId: number,
        devicename: string,
        startendTime: Array<Date>,
    ): Observable<{ data: Array<RandomUser> }> {

        let params: HttpParams = new HttpParams();
        if (!startendTime.length) {
            params = params
                .append('robotId', robotId.toString())
                .append('deviceName', devicename);
        } else {
            params = params
                .append('robotId', robotId.toString())
                .append('deviceName', devicename)
                .append('startTime',this.returnDate(startendTime[0]))
                .append('endTime', this.returnDate(startendTime[1]));
        }
        console.log(params);
        return this.http.get<{ data: Array<RandomUser> }>(`${environment.apiUrl}/hkipc/queryAllData`, { params })
            .pipe(catchError(() => of({ data: [] })));

    }

    public getButtoneed(
        robotId: number,
    ): Observable<{ data: Array<robotGet> }> {

        let params: HttpParams = new HttpParams().append('robotId', robotId.toString());
        return this.http.get<{ data: Array<robotGet> }>(`${environment.apiUrl}/hkipc/queryDevice`, { params })
            .pipe(catchError(() => of({ data: [] })));
    }

    public returnDate(date?: Date): string | number {
        if (date){
            let formattedDate =
                date.getFullYear() +
                '-' +
                String(date.getMonth() + 1).padStart(2, '0') +
                '-' +
                String(date.getDate()).padStart(2, '0') +
                ' ' +
                String(date.getHours()).padStart(2, '0') +
                ':' +
                String(date.getMinutes()).padStart(2, '0') +
                ':' +
                String(date.getSeconds()).padStart(2, '0');
                return formattedDate.toString();
        }else{
            return 0;
        }



    }

}
