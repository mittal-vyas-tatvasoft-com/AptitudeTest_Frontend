import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { validations } from 'src/app/shared/messages/validation.static';
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
      userRegistration: [false],
      camera: [false],
      clearResponseButton: [false],
      screenCapture: [false],
      intervalForScreenCapture: [0, [Validators.min(0)]],
      cutOff: [0, [Validators.min(0)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(validations.common.emailREGEX),
        ],
      ],
      password: ['', Validators.required],
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
          email: res.data.email,
          password: res.data.password,
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

  onIconClick(event: any) {
    if (event.inputType === 'text') {
      event.inputType = 'password';
      this.settingControls.Password.iconName =
        'password-visibility-show-dark.svg';
    } else {
      event.inputType = 'text';
      this.settingControls.Password.iconName =
        'password-visibility-hide-dark.svg';
    }
  }
}
