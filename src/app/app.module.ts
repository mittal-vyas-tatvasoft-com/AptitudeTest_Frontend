import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MastersModule } from './modules/masters/masters.module';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthTokenInterceptor } from './core/interceptors/auth/auth-token.interceptor';
import { CandidateModule } from './modules/candidate/candidate.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ResultsModule } from './modules/results/results.module';
import { TestModule } from './modules/test/test.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MastersModule,
    UsersModule,
    CoreModule,
    HttpClientModule,
    CandidateModule,
    TestModule,
    GroupsModule,
    ResultsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
