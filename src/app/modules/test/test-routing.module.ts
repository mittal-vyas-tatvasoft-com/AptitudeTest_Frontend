import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navigation } from 'src/app/shared/common/enum';
import { TestComponent } from './component/test/test.component';
import { CreateTestComponent } from './component/create-test/create-test.component';

const routes: Routes = [
  {
    path: '',
    component: TestComponent
  },
  {
    path: `${Navigation.CreateTest}`,
    component: CreateTestComponent  
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
