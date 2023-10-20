import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LoginModel } from 'src/app/core/auth/interfaces/login.interface';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  private baseUrl = 'https://localhost:7282/api/Technologies';

  constructor(private http: HttpClient) { }

  getTechnologies(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getFilteredTechnologies(filterValue: string, searchValue: string, pageIndex: number, pageSize: number): Observable<any> {
    const apiUrl = this.createApiUrl(filterValue, searchValue, pageIndex, pageSize);
    return this.http.get(apiUrl);
  }
  
  private createApiUrl(filterValue: string, searchValue: string, pageIndex: number, pageSize: number): string {
    let apiUrl = `${this.baseUrl}?currentPageIndex=${pageIndex}&pageSize=${pageSize}`;
  
    if (filterValue && filterValue !== 'all') {
      apiUrl += `&filter=${filterValue}`;
    }
  
    if (searchValue) {
      apiUrl += `&searchQuery=${searchValue}`;
    }
  
    return apiUrl;
  }

  updateTechnology(element: any): Observable<ResponseModel<string>> {
    return this.http
    .put<ResponseModel<string>>(`${environment.baseURL}Technologies/Update`, element)
    .pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  addTechnology(element:any): Observable<ResponseModel<string>>{
    return this.http.post<ResponseModel<string>>(`${environment.baseURL}Technologies/Create`, element)
    .pipe(
      map((res:any)=>{
        return res;
      })
    )
  }

  deleteTechnology(id: any): Observable<any> {
    return this.http
    .delete<ResponseModel<string>>(`${environment.baseURL}Technologies/Delete?id=${id}`)
    .pipe(
      map((res: any) => {
          console.log("Deleteres",res)
        return res;
      }),
    );
  }

  checkAllTechnologies(status: boolean): Observable<any> {
    const url = `${this.baseUrl}/CheckUncheckAll?check=${status}`;
    return this.http.put<any>(url, { status: status });
  }
}
