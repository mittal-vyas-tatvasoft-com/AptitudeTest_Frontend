import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserImporterRountingModule } from './user-importer-rounting.module';
import { UserImporterComponent } from './components/user-importer/user-importer.component';
import { UserImporterMainComponent } from './components/container/user-importer-main/user-importer-main.component';
import { ImportedUsersListComponent } from './components/imported-users-list/imported-users-list.component';



@NgModule({
  declarations: [
    UserImporterComponent,
    UserImporterMainComponent,
    ImportedUsersListComponent
  ],
  imports: [
    CommonModule,
    UserImporterRountingModule
  ]
})
export class UserImporterModule { }
