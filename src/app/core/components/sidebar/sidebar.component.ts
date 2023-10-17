import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 991px)'])
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
}
