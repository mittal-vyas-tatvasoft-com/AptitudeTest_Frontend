import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-management',
    pathMatch: 'full',
  },
{
    path:'user-management',
    loadChildren: () =>
    import('./user-management/user-management.module').then((m) => m.UserManagementModule)
},
{
    path:'group-management',
    loadChildren: () =>
    import('./group-management/group-management.module').then((m) => m.GroupManagementModule)
},
{
    path:'user-selection',
    loadChildren: () =>
    import('./user-selection/user-selection.module').then((m) => m.UserSelectionModule)
},
{
    path:'users-online',
    loadChildren: () =>
    import('./users-online/users-online.module').then((m) => m.UsersOnlineModule)
},
{
    path:'user-importer',
    loadChildren: () =>
    import('./user-importer/user-importer.module').then((m) => m.UserImporterModule)
},
{
  path:'users-results',
  loadChildren: () =>
  import('./users-results/users-results.module').then((m) => m.UsersResultsModule)
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsersRoutingModule { }