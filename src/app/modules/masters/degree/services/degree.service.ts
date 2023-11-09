import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UpdateStatus } from '../components/degree/degree.component';

@Injectable({
  providedIn: 'root',
})
export class DegreeService {
  constructor(private httpClient: HttpClient) {}

  degrees(sortField: string | null, sortOrder: string | null) {
    const params: any = {
      sortField,
      sortOrder,
    };
    return this.httpClient.get(`${environment.baseURL}Degrees`, { params });
  }

  get(id: number) {
    return this.httpClient.get(`${environment.baseURL}Degrees/Get?id=${id}`);
  }

  updateStatus(status: UpdateStatus) {
    return this.httpClient.put(
      `${environment.baseURL}Degrees/UpdateStatus`,
      status
    );
  }

  delete(id: number) {
    return this.httpClient.delete(
      `${environment.baseURL}Degrees/Delete?id=${id}`
    );
  }

  create(degree: any) {
    return this.httpClient.post(`${environment.baseURL}Degrees/Create`, degree);
  }

  update(degree: any) {
    return this.httpClient.put(`${environment.baseURL}Degrees/Update`, degree);
  }
}
