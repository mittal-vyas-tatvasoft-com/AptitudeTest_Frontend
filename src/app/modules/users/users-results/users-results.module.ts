import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersResultsRountingModule } from './users-results-rounting.module';
import { UsersResultsComponent } from './components/users-results/users-results.component';
import { UsersResultsMainComponent } from './components/users-results-main/users-results-main.component';
import { UsersResultsStatisticsComponent } from './components/users-results-statistics/users-results-statistics.component';



@NgModule({
  declarations: [
    UsersResultsComponent,
    UsersResultsMainComponent,
    UsersResultsStatisticsComponent
  ],
  imports: [
    CommonModule,
    UsersResultsRountingModule
  ]
})
export class UsersResultsModule { }
