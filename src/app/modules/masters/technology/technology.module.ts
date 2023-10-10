import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnologyRoutingModule } from './technology-routing.module';
import { AddTechnologyComponent } from './components/add-technology/add-technology.component';
import { TechnologyComponent } from './components/technology/technology.component';



@NgModule({
  declarations: [
    AddTechnologyComponent,
    TechnologyComponent
  ],
  imports: [
    CommonModule,
    TechnologyRoutingModule
  ]
})
export class TechnologyModule { }
