import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { LocationComponent } from './components/location/location.component';
import { LocationRoutingModule } from './location-routing.module';



@NgModule({
  declarations: [
    AddLocationComponent,
    LocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule
  ]
})
export class LocationModule { }
