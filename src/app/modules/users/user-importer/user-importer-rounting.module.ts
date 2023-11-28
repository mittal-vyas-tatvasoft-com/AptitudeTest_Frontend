import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserImporterMainComponent } from './components/container/user-importer-main/user-importer-main.component';

const routes: Routes = [
  {
    path: '',
    component: UserImporterMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserImporterRountingModule {}
