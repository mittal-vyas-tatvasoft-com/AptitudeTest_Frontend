import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingService } from '../services/setting.service';
import { SettingControls } from '../configs/setting.config';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Setting } from '../interfaces/setting';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { Subscription, pairwise } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  settingForm: FormGroup;
  settingControls = SettingControls;
  formChanges: Subscription;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.settingForm = this.fb.group({
      userRegistration: [''],
      camera: [''],
      screenCapture: [''],
    });

    this.settingService.get().subscribe({
      next: (res: ResponseModel<Setting>) => {
        this.settingForm.setValue({
          userRegistration: res.data.userRegistration,
          camera: res.data.camera,
          screenCapture: res.data.screenCapture,
        });
      },
      error: (error) => {
        this.snackbarService.error(error.message);
      },
    });

    this.formChanges = this.settingForm.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]) => {
        this.settingService.update(next).subscribe({
          next: (res) => {
            this.snackbarService.success(res.message);
          },
          error: (error) => {
            this.formChanges.unsubscribe();
            this.settingForm.setValue(prev);
            this.snackbarService.error(error.message);
          },
        });
      });
  }
}
