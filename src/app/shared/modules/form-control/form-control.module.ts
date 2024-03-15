import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedMaterialModule } from '../../material/shared-material.module';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import {
  DatePickerComponent,
  MY_DATE_FORMAT,
} from './components/date-picker/date-picker.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { SelectComponent } from './components/select/select.component';
import { TextControlCharacterComponent } from './components/text-control-character/text-control-character.component';
import { TextControlNumberComponent } from './components/text-control-number/text-control-number.component';
import { TextControlComponent } from './components/text-control/text-control.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { CharactersOnlyDirective } from './directives/characters-only.directive';
import { MaxLengthDirective } from './directives/max-length.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { NumbersAndDecimalsOnlyDirective } from './directives/numbers-and-decimals-only.directive';

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
    CharactersOnlyDirective,
    TextControlCharacterComponent,
    MaxLengthDirective,
    NumbersAndDecimalsOnlyDirective,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
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
    NumbersAndDecimalsOnlyDirective,
    CharactersOnlyDirective,
    MaxLengthDirective,
    DatePickerComponent,
    TextControlCharacterComponent,
  ],
})
export class FormControlModule {}
