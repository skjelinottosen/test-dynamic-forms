import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


const passThroughArray = [
  CommonModule,
  NgbModule,
  NgSelectModule,
  FormsModule,
];

@NgModule({
  imports: passThroughArray,
  exports: passThroughArray
})
export class DynamicFormMaterialModule {}
