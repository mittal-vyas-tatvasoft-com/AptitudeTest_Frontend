import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAdmins(
    currentPageIndex: number,
    pageSize: number,
    searchQuery: string | null,
    status: boolean | null
  ) {
    const params: any = {
      searchQuery,
      currentPageIndex,
      pageSize,
    };

    if (status != null) {
      params.Status = status;
    }
    return this.http.get(`${environment.baseURL}Admin/GetAllAdmins`, {
      params,
    });
  }

  getAdminById(id: number) {
    return this.http.get(`${environment.baseURL}Admin/GetAdminById/${id}`);
  }
}
