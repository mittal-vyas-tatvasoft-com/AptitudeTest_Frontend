import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStreamComponent } from './components/add-stream/add-stream.component';
import { StreamComponent } from './components/stream/stream.component';
import { StreamRoutingModule } from './stream-routing.module';



@NgModule({
  declarations: [
    AddStreamComponent,
    StreamComponent
  ],
  imports: [
    CommonModule,
    StreamRoutingModule
  ]
})
export class StreamModule { }
