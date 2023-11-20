import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Navigation } from 'src/app/shared/common/enums';
import { CreateTestComponent } from './containers/create-test/create-test.component';
import { TestComponent } from './containers/test/test.component';

const routes: Routes = [
  {
    path: '',
    component: TestComponent,
  },
  {
    path: `${Navigation.CreateTest}`,
    component: CreateTestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
