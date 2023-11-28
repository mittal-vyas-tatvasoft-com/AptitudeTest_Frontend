import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';

@Component({
  selector: 'app-mcq-test',
  templateUrl: './mcq-test.component.html',
  styleUrls: ['./mcq-test.component.scss'],
})
export class McqTestComponent implements OnInit {
  options = [
    { isChecked: true, optionLetter: 'A' },
    { isChecked: false, optionLetter: 'B' },
    { isChecked: false, optionLetter: 'C' },
    { isChecked: false, optionLetter: 'D' },
  ];
  firstName: string;
  lastName: string;

  constructor(public loginService: LoginService) {}
  ngOnInit(): void {
    const s = this.loginService.decodeToken();
    this.firstName = s.FirstName;
    this.lastName = s.Name;
  }
  toggleCheckbox(index: number) {
    this.options[index].isChecked = !this.options[index].isChecked;
  }
}
