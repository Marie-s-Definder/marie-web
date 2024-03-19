import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RandomUser {
    id: string;
    building: string;
    room: string;
    name: string;
    status: string;
}

@Injectable({ providedIn: 'root' })
export class GetRobotStatusService {

    // private readonly http: HttpClient;
    public constructor(private readonly http: HttpClient) {}

    public getUsers(
        buildingname: string | null,
        roomname: string | undefined,
    ): Observable<{ data: Array<RandomUser> }> {
        let params: HttpParams = new HttpParams()
            .append('building', `${buildingname}`)
            .append('room', `${roomname}`);
        return this.http
            .get<{ data: Array<RandomUser> }>(`${environment.apiUrl}/hkipc/queryRobot`, { params })
            .pipe(catchError(() => of({ data: [] })));
    }

}
