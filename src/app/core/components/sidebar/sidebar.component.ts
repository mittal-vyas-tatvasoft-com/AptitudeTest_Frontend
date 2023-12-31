import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from '../../auth/services/login.service';
import { navBarRoutes } from '../../configs/side-nav-routes.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  ngUnsubscribe$ = new Subject<void>();
  expandBtn = '+';
  collapseBtn = '-';
  routeConfig = navBarRoutes;
  isLoggedIn!: boolean;
  temp!: number;
  collapse!: -1;
  currentlyOpenAccordion: number | null = null;
  @Input() isSidebarOpen!: boolean;
  @Output() menuIconClickEvent = new EventEmitter();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    this.isSidebarOpen = this.loginService.getStateFromLocalStorage();
  }

  toggleAccordion(index: number) {
    this.currentlyOpenAccordion =
      this.currentlyOpenAccordion === index ? null : index;
  }

  onClick() {
    this.menuIconClickEvent.emit();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
