import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'college',
        pathMatch: 'full',
      },
    {
        path:'college',
        loadChildren: () =>
        import('./college/college.module').then((m) => m.CollegeModule)
    },
    {
        path:'degree',
        loadChildren: () =>
        import('./degree/degree.module').then((m) => m.DegreeModule)
    },
    {
        path:'location',
        loadChildren: () =>
        import('./location/location.module').then((m) => m.LocationModule)
    },
    {
        path:'stream',
        loadChildren: () =>
        import('./stream/stream.module').then((m) => m.StreamModule)
    },
    {
        path:'technology',
        loadChildren: () =>
        import('./technology/technology.module').then((m) => m.TechnologyModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MastersRoutingModule { }