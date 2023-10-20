import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { LoginService } from '../auth/services/login.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isSidebarOpen!: boolean;

  constructor(private breakpointObserver: BreakpointObserver,
    private loginService: LoginService) {   
   this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
   }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 1199px)'])
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
}
