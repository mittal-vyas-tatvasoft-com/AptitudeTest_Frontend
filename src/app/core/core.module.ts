import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { RouterModule } from '@angular/router';
import { SideBarNavigationComponent } from './components/side-bar-navigation/side-bar-navigation.component';
import { CoreComponent } from './core.component';


@NgModule({
  declarations: [
    CoreComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    BreadCrumbComponent,
    SideBarNavigationComponent
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
