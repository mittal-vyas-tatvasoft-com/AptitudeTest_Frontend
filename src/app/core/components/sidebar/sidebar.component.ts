import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() onMenuIconClick = new EventEmitter();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
     this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
  }
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );


  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  @Input() isSidebarOpen!: boolean;
  currentlyOpenAccordion: number | null = null;

  // Function to toggle the open state of a mat-accordion
  toggleAccordion(index: number) {
    this.currentlyOpenAccordion = this.currentlyOpenAccordion === index ? null : index;
  }

  onClick() {
    this.onMenuIconClick.emit();
  }
}
