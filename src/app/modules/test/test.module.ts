import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestService } from './services/test.service';
import { SharedMaterialModule } from 'src/app/shared/material/shared-material.module';
import { TestRoutingModule } from './test-routing.module';
import { CreateTestComponent } from './component/create-test/create-test.component';
import { CoreModule } from 'src/app/core/core.module';
import { TestComponent } from './component/test/test.component';
import { FormControlModule } from 'src/app/shared/modules/form-control/form-control.module';
import { EditQuestionComponent } from './component/edit-question/edit-question.component';

@NgModule({
  declarations: [
    TestComponent,
    CreateTestComponent,
    EditQuestionComponent,
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    SharedMaterialModule,
    FormControlModule
  ],
  providers: [
    TestService,
  ]
})
export class TestModule { }
