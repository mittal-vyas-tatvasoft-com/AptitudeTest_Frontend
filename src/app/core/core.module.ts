import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '../shared/material/shared-material.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    SidebarComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    RouterModule,
    SharedMaterialModule,
  ],
  exports: [FooterComponent, HeaderComponent],
})
export class CoreModule {}
