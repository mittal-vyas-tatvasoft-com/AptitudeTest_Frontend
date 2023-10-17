import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { BreadCrumbService } from '../../services/bread-crumb.service';
import { BreadCrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss'],
})
export class BreadCrumbComponent {
  public breadcrumbs!: BreadCrumb[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadCrumbService: BreadCrumbService,
  ) {
    this.loadRouteUrl();
  }
  loadRouteUrl() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.displayBreadCrumbs();
      });
  }
  displayBreadCrumbs() {
    this.breadcrumbs = this.breadCrumbService.buildBreadCrumbs(
      this.activatedRoute.root,
      '',
    );
  }
}
