import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DynamicFieldComponent } from 'lib/dynamic-field/dynamic-field.component';
import { DynamicFormComponent } from 'lib/dynamic-form/dynamic-form.component';
import { SentenceCasePipe } from 'lib/sentence-case.pipe';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DynamicReactiveFormModule } from '../../lib/dynamic-reactive-form.module';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicReactiveFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
