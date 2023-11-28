import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  firstName: string;
  lastName: string;
  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    const s = this.loginService.decodeToken();
    this.firstName = s.FirstName;
    this.lastName = s.Name;
  }
}
