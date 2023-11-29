import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { ProfileModel } from '../interfaces/profile.interface';

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
    return this.http
      .get<ResponseModel<ProfileModel[]>>(`${environment.baseURL}Profiles`, {
        params,
      })
      .pipe((res) => {
        return res;
      });
  }

  GetProfileById(id: number) {
    return this.http
      .get<ResponseModel<ProfileModel>>(
        `${environment.baseURL}Profiles/Get/${id}`
      )
      .pipe((res) => {
        return res;
      });
  }

  ChangeSingleProfileStatus(id: number, status: boolean) {
    const payload = {
      id: id,
      status: status,
    };

    return this.http
      .put<ResponseModel<string>>(
        `${environment.baseURL}Profiles/UpdateStatus`,
        payload
      )
      .pipe((res) => {
        return res;
      });
  }

  AddNewProfile(data: ProfileModel) {
    return this.http
      .post<ResponseModel<string>>(
        `${environment.baseURL}Profiles/Create`,
        data
      )
      .pipe((res) => {
        return res;
      });
  }

  UpdateProfile(data: ProfileModel) {
    return this.http
      .put<ResponseModel<string>>(`${environment.baseURL}Profiles/Update`, data)
      .pipe((res) => {
        return res;
      });
  }

  DeleteProfile(id: number) {
    return this.http
      .delete<ResponseModel<string>>(
        `${environment.baseURL}Profiles/Delete?id=${id}`
      )
      .pipe((res) => {
        return res;
      });
  }
}
