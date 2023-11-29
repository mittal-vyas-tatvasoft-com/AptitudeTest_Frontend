import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { SharedMaterialModule } from '../../material/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { SelectComponent } from './components/select/select.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { TextControlComponent } from './components/text-control/text-control.component';
import { TextControlNumberComponent } from './components/text-control-number/text-control-number.component';
import { ButtonComponent } from './components/button/button.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CharactersOnlyDirective } from './directives/characters-only.directive';
import { TextControlCharacterComponent } from './components/text-control-character/text-control-character.component';
import { MaxLengthDirective } from './directives/max-length.directive';

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
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
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
    CharactersOnlyDirective,
    MaxLengthDirective,
    DatePickerComponent,
    TextControlCharacterComponent,
  ],
})
export class FormControlModule {}
