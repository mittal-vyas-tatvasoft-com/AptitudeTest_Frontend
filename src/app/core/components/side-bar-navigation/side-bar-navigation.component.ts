import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from '../../auth/services/login.service';
import { navBarRoutes } from '../../configs/side-nav-routes.config';


@Component({
  selector: 'app-side-bar-navigation',
  templateUrl: './side-bar-navigation.component.html',
  styleUrls: ['./side-bar-navigation.component.scss'],
})
export class SideBarNavigationComponent implements OnInit {
  ngUnsubscribe$ = new Subject<void>();
  expandBtn = '+';
  collapseBtn = '-';

  routeConfig = navBarRoutes;
  isLoggedIn!: boolean;
  temp!: number;
  collapse!: -1;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
  }
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  logout() {
    this.loginService.logout();
  }

  // edit(event: FlatNode) {
  //   event.level == Website.Client
  //     ? this.router.navigate([
  //         `${Navigation.Admin}/${Navigation.Portal}/${Navigation.clients}/${Navigation.Edit}/${event.id}`,
  //       ])
  //     : this.router.navigate([
  //         `${Navigation.Admin}/${Navigation.Portal}/${Navigation.Edit}/${event.id}`,
  //       ]);
  // }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
