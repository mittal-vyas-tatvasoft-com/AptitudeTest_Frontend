import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UpdateStatus } from '../components/degree/degree.component';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { DegreeModel } from '../interfaces/degree.interface';

@Injectable({
  providedIn: 'root',
})
export class DegreeService {
  constructor(private httpClient: HttpClient) {}

  degrees(sortField: string | null, sortOrder: string | null) {
    let params = new HttpParams();
    if (sortField != null) {
      params = params.set('sortField', sortField);
    }

    if (sortOrder != null) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.httpClient.get<ResponseModel<DegreeModel[]>>(
      `${environment.baseURL}Degrees`,
      { params }
    );
  }

  get(id: number) {
    return this.httpClient.get<ResponseModel<DegreeModel>>(
      `${environment.baseURL}Degrees/Get?id=${id}`
    );
  }

  updateStatus(status: UpdateStatus) {
    return this.httpClient.put<ResponseModel<number>>(
      `${environment.baseURL}Degrees/UpdateStatus`,
      status
    );
  }

  delete(id: number) {
    return this.httpClient.delete<ResponseModel<null>>(
      `${environment.baseURL}Degrees/Delete?id=${id}`
    );
  }

  create(degree: DegreeModel) {
    return this.httpClient.post<ResponseModel<null>>(
      `${environment.baseURL}Degrees/Create`,
      degree
    );
  }

  update(degree: DegreeModel) {
    return this.httpClient.put<ResponseModel<null>>(
      `${environment.baseURL}Degrees/Update`,
      degree
    );
  }
}
