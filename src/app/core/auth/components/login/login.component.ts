import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginModel } from '../../interfaces/login.interface';
import { loginControl } from '../../configs/login.config';
import { Subject, takeUntil } from 'rxjs';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  form!: FormGroup;
  submitted = false;
  loginFailed = false;
  loginModel = loginControl;
  private ngUnsubscribe$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loginFailed = false;

    if (this.form.valid) {
      const loginData: LoginModel = {
        username: this.form.value.userName,
        password: this.form.value.password
      };
      this.submitted = true;

    this.loginService.login(loginData)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: ResponseModel<string>) => {
            console.log("res",res)
            if (res.result) {
              if (res.statusCode === 200) {
                console.log("called")
                this.router.navigate([
                  '/masters'
                ]);
              }
            }else{
              this.loginFailed = true;
            }
          },
          error: (error) => {
            this.loginFailed = true;
            this.submitted = false;
          console.log("loggin error")
          },
        });
    } 

  }

  onIconClick(event: any) {
    if (event.formControlModel.inputType == 'text') {
      event.formControlModel.inputType = 'password';
    } else {
      event.formControlModel.inputType = 'text';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
