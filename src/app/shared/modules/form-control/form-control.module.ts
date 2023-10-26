import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { SharedMaterialModule } from '../../material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { DATE_FORMAT } from './static/date-format';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { SelectComponent } from './components/select/select.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { TextControlComponent } from './components/text-control/text-control.component';
import { TextControlNumberComponent } from './components/text-control-number/text-control-number.component';
import { ButtonComponent } from './components/button/button.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    NumbersOnlyDirective,
    DatePickerComponent,
    TimePickerComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,
    SelectComponent,
    MultiSelectComponent,
    TextControlComponent,
    TextControlNumberComponent,
    ButtonComponent,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ],
  imports: [
    CommonModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    NgxMatTimepickerModule,
  ],
  exports: [
    ButtonComponent,
    TextControlComponent,
    SelectComponent,
    TextControlNumberComponent,
    TimePickerComponent,
    NumbersOnlyDirective,
    DatePickerComponent,
  ],
})
export class FormControlModule {}
