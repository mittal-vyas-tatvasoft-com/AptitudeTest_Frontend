import { Injectable } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { BreadCrumb } from '../components/bread-crumb/breadcrumb.interface';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {

  buildBreadCrumbs(activatedRoute: ActivatedRoute, url = '') {
    const children: ActivatedRoute[] = activatedRoute.children;

    if (children.length === 0) {
      return [];
    }

    let breadCrumbs: BreadCrumb[] = [];

    for (const child of children) {
      const routeUrl: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeUrl !== '') {
        url += `/${routeUrl}`;
      }

      const routeData: Data = child.snapshot.data;
      if (routeData['breadCrumb']) {
        breadCrumbs.push({ label: routeData['breadCrumb'], url: url });
      } else if (routeData['apiData']?.breadCrumb) {
        breadCrumbs.push({
          label: routeData['apiData'].breadCrumb,
          url: url,
        });
      }

      breadCrumbs = breadCrumbs.concat(this.buildBreadCrumbs(child, url));
    }
    return breadCrumbs;
  }
}
