import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { LoginService } from '../auth/services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isSidebarOpen!: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 1199px)'])
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private loginService: LoginService) {}

  ngOnInit(): void {
    this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
  }
}
