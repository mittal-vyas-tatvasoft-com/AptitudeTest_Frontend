import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { AdminModel } from '../interfaces/admin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAdmins(
    currentPageIndex: number,
    pageSize: number,
    searchQuery: string | null,
    status: boolean | null,
    sortField: string | null,
    sortOrder: string | null
  ) {
    const params: any = {
      searchQuery,
      currentPageIndex,
      pageSize,
      sortField,
      sortOrder,
    };

    if (status != null) {
      params.Status = status;
    }
    return this.http.get(`${environment.baseURL}Admin/GetAllAdmin`, {
      params,
    });
  }

  getAdminById(id: number) {
    return this.http.get(`${environment.baseURL}Admin/GetAdminById/${id}`);
  }

  addNewAdmin(newAdmin: AdminModel) {
    return this.http.post<ResponseModel<string>>(
      `${environment.baseURL}Admin/Create`,
      newAdmin
    );
  }

  updateAdmin(updatedData: AdminModel) {
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}Admin/Update`,
      updatedData
    );
  }

  deleteAdmin(id: any) {
    return this.http.delete<ResponseModel<string>>(
      `${environment.baseURL}Admin/Delete/${id}`
    );
  }

  updateStatus(id: number, status: boolean) {
    const payload = {
      id: id,
      status: status,
    };
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}Admin/ActiveInActiveAdmin`,
      payload
    );
  }
}
