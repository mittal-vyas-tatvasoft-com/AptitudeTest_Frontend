import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { CollegeModel } from '../../masters/college/interfaces/college.interface';
import { GroupsModel } from '../interfaces/groups.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private httpClient: HttpClient) {}

  groups(
    searchedGroup?: string,
    searchedCollegeId?: number
  ): Observable<GroupsModel[]> {
    let params = new HttpParams();

    if (searchedGroup !== undefined) {
      params = params.set('searchGroup', searchedGroup);
    }
    if (searchedCollegeId !== undefined) {
      params = params.set('collegeId', searchedCollegeId);
    }

    return this.httpClient
      .get<ResponseModel<string>>(`${environment.baseURL}Groups`, { params })
      .pipe(map((response: any) => response.data));
  }

  colleges(): Observable<CollegeModel[]> {
    return this.httpClient
      .get(`${environment.baseURL}Colleges/GetActiveColleges`)
      .pipe(map((response: any) => response.data));
  }

  create(group: GroupsModel): Observable<ResponseModel<string>> {
    return this.httpClient
      .post<ResponseModel<string>>(`${environment.baseURL}Groups/Create`, group)
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }

  update(group: GroupsModel): Observable<ResponseModel<string>> {
    return this.httpClient.put<ResponseModel<string>>(
      `${environment.baseURL}Groups/Update`,
      group
    );
  }

  delete(id: number): Observable<ResponseModel<string>> {
    return this.httpClient
      .delete<ResponseModel<string>>(
        `${environment.baseURL}Groups/Delete?id=${id}`
      )
      .pipe(
        map((res: ResponseModel<string>) => {
          return res;
        })
      );
  }
}
