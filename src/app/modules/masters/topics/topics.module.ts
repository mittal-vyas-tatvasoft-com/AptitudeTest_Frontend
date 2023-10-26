import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicsRoutingModule } from './topics-routing.module';
import { TopicsComponent } from './components/topics/topics.component';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { AddTopicsComponent } from './components/add-topics/add-topics.component';


@NgModule({
  declarations: [
    TopicsComponent,
    AddTopicsComponent
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    TopicsRoutingModule
  ]
})
export class TopicsModule { }
