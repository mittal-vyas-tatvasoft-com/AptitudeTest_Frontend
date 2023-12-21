import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { SettingControls } from '../configs/setting.config';
import { Setting } from '../interfaces/setting';
import { SettingService } from '../services/setting.service';

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
      clearResponseButton: [''],
      screenCapture: [''],
      intervalForScreenCapture: [0, [Validators.min(0)]],
      cutOff: [0, [Validators.min(0)]],
    });

    this.settingService.get().subscribe({
      next: (res: ResponseModel<Setting>) => {
        this.settingForm.setValue({
          userRegistration: res.data.userRegistration,
          camera: res.data.camera,
          clearResponseButton: res.data.clearResponseButton,
          screenCapture: res.data.screenCapture,
          intervalForScreenCapture: +res.data.intervalForScreenCapture,
          cutOff: +res.data.cutOff,
        });
      },
      error: (error) => {
        this.snackbarService.error(error.message);
      },
    });
  }

  save() {
    this.formChanges = this.settingService
      .update(this.settingForm.value)
      .subscribe({
        next: (res) => {
          this.snackbarService.success(res.message);
        },
        error: (error) => {
          this.formChanges.unsubscribe();
          this.snackbarService.error(error.message);
        },
      });
  }
}
