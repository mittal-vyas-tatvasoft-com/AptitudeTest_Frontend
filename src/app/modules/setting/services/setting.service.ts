import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { Setting } from '../interfaces/setting';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) {}
  offCampusRegistration: boolean;

  get() {
    return this.http.get<ResponseModel<Setting>>(
      `${environment.baseURL}Settings/Get`
    );
  }

  update(setting: Setting) {
    return this.http.put<ResponseModel<string>>(
      `${environment.baseURL}Settings/Update`,
      setting
    );
  }

  OffCampusMode(): boolean {
    this.get().subscribe({
      next: (res) => {
        this.offCampusRegistration = res.data.userRegistration;
      },
    });
    return this.offCampusRegistration;
  }
}
