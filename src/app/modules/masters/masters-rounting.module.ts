import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'technology',
        pathMatch: 'full',
    },
    {
        path: 'college',
        loadChildren: () =>
            import('./college/college.module').then((m) => m.CollegeModule)
    },
    {
        path: 'degree',
        loadChildren: () =>
            import('./degree/degree.module').then((m) => m.DegreeModule)
    },
    {
        path: 'topics',
        loadChildren: () =>
            import('./topics/topics.module').then((m) => m.TopicsModule)
    },
    {
        path: 'profile',
        loadChildren: () =>
            import('./profile/profile.module').then((m) => m.ProfileModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MastersRoutingModule { }