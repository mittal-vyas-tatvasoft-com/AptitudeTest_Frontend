import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    FooterComponent,
    BreadCrumbComponent,
    SidebarComponent,
    LayoutComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    RouterModule,
    SharedMaterialModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent
  ]
})
export class CoreModule { }
