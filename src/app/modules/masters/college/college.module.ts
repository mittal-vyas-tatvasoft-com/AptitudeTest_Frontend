import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeComponent } from './components/college/college.component';
import { AddCollegeComponent } from './components/add-college/add-college.component';
import { CollegeRountingModule } from './college-routing.module';
import { CoreModule } from 'src/app/core/core.module';



@NgModule({
  declarations: [
    AddCollegeComponent,
    CollegeComponent
  ],
  imports: [
    CommonModule,
    CollegeRountingModule,
    CoreModule
  ]
})
export class CollegeModule { }
