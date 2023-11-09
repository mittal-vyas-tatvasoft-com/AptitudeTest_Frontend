import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}
  // Profiles
  GetAllProfiles(sortField: string | null, sortOrder: string | null) {
    const params: any = {
      sortField,
      sortOrder,
    };
    return this.http.get(`${environment.baseURL}Profiles`, { params });
  }

  GetProfileById(id: number) {
    return this.http.get(`${environment.baseURL}Profiles/Get/${id}`);
  }

  ChangeSingleProfileStatus(id: number, status: boolean) {
    const payload = {
      id: id,
      status: status,
    };

    return this.http.put(
      `${environment.baseURL}Profiles/UpdateStatus`,
      payload
    );
  }

  AddNewProfile(data: any) {
    return this.http.post(`${environment.baseURL}Profiles/Create`, data);
  }

  UpdateProfile(data: any) {
    return this.http.put(`${environment.baseURL}Profiles/Update`, data);
  }

  DeleteProfile(id: number) {
    return this.http.delete(`${environment.baseURL}Profiles/Delete?id=${id}`);
  }
}
