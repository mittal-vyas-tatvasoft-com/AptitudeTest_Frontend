import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from '../../auth/services/login.service';
import { navBarRoutes } from '../../configs/side-nav-routes.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
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
  ) { }

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

  currentlyOpenAccordion: number | null = null;

  // Function to toggle the open state of a mat-accordion
  toggleAccordion(accordionIndex: number) {
    if (this.currentlyOpenAccordion === accordionIndex) {
      this.currentlyOpenAccordion = null; // Close the accordion if it's already open
    } else {
      this.currentlyOpenAccordion = accordionIndex; // Open the accordion
    }
  }
}
