import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { Navigation } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getToken();
  }
  getToken() {
    const data = this.loginService.decodeToken();
    if (data) {
      if (
        (this.activatedRoute.snapshot.url.length === 0 ||
          this.activatedRoute.snapshot.url.some(
            (segment) => segment.path === 'register'
          )) &&
        data.Role === Navigation.RoleAdmin
      ) {
        this.router.navigate([`${Navigation.Admin}`]);
      } else {
        this.router.navigate([`${Navigation.CandidateUser}`]);
      }
    }
  }
}
