import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFieldComponent } from './dynamic-field/dynamic-field.component';
import { SentenceCasePipe } from './sentence-case.pipe';
import { DynamicFormMaterialModule } from './dynamic-form-material.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [DynamicFieldComponent, DynamicFormComponent, SentenceCasePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFormMaterialModule,
  ],
  exports: [DynamicFormComponent]
})
export class DynamicReactiveFormModule { }
