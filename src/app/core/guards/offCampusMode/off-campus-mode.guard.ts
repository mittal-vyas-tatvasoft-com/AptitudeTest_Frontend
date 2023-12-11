import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SettingService } from 'src/app/modules/setting/services/setting.service';

@Injectable({
  providedIn: 'root',
})
export class OffCampusModeGuard {
  OffCampusMode: boolean;
  constructor(private settingService: SettingService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((res) => {
      this.settingService.get().subscribe({
        next: (data) => {
          res(data.data.userRegistration);
          if (data.data.userRegistration === false) {
            this.router.navigate(['404']);
          }
          this.OffCampusMode = data.data.userRegistration;
        },
      });
    });
  }
}
