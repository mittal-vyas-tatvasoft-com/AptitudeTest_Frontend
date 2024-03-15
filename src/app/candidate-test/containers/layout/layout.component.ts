import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';
import { CandidateTestService } from '../../services/candidate-test.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(private loginService: LoginService) {}
  ngOnInit(): void {
    this.loginService.checkTestSubmitted();
    this.loginService.checkProfileNotSaved();
  }

  getRole(): boolean {
    var role = this.loginService.getUserRole();
    if (role === 'Admin') {
      return true;
    } else {
      return false;
    }
  }
}
