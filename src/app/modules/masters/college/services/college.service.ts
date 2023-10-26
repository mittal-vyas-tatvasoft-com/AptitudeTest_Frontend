import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { CollegeModel } from '../interfaces/college.interface';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  constructor(private http: HttpClient) {}

  getColleges(
    currentPageIndex: number,
    pageSize: number
  ): Observable<ResponseModel<string>> {
    const params = new HttpParams()
      .set('currentPageIndex', currentPageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ResponseModel<string>>(`${environment.baseURL}Colleges`, { params })
      .pipe(map((response: any) => response.data));
  }


  addCollege(element:CollegeModel): Observable<ResponseModel<string>>{
    return this.http.post<ResponseModel<string>>(`${environment.baseURL}Colleges/Create`, element)
    .pipe(
      map((res:ResponseModel<string>)=>{
        return res;
      })
    )
  }

  updateCollege(element: CollegeModel): Observable<ResponseModel<string>> {
    return this.http
    .put<ResponseModel<string>>(`${environment.baseURL}Colleges/Update`, element)
    .pipe(
      map((res: ResponseModel<string>) => {
        return res;
      }),
    );
  }

  deleteCollege(id: any): Observable<ResponseModel<string>> {
    return this.http
    .delete<ResponseModel<string>>(`${environment.baseURL}Colleges/Delete?id=${id}`)
    .pipe(
      map((res: ResponseModel<string>) => {
        return res;
      }),
    );
  }
}
