import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KeyValuePair } from 'lib/dynamic-reactive-form.model';
import { DynamicReactiveFormService } from 'lib/dynamic-reactive-form.service';
 
export enum FieldType {
  CHECKBOX,
  DATEPICKER,
  RADIO,
  SELECTDROPDOWN,
  SELECTLIST,
  SLIDETOGGLE,
  TEXTAREA,
  TEXTFIELD,
  SUBHEADER,
  DIVIDER
}

export interface Field {
  name: string;
  type: FieldType;
  children?: Field[]; 
  defaultValue?: any;
  disabled?: boolean;
  options?: string[];
  parent?: string;
  validation?: Validators[];
  visible?: boolean;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public formData!: FormGroup;

  public control!: FormControl;
  public FieldType = FieldType;
  form: Field[] = [
    {
      name: 'GLN',
      type: FieldType.TEXTFIELD
    },

    {
      name: 'Date',
      type: FieldType.DATEPICKER,
    },
    {
      name: 'Pakning',
      type: FieldType.SELECTDROPDOWN,
      options: ['Basis', 'Mellom 1', 'Mellom 2', 'Top']
    },

    /*
    {
      name: 'firstName',
      type: FieldType.TEXTFIELD,
      validation: [ Validators.required, Validators.maxLength(25) ]
    },
    {
      name: 'lastName',
      type: FieldType.TEXTFIELD
    },
    {
      name: 'favoriteFood',
      type: FieldType.SELECTDROPDOWN,
      options: ['Ice Cream', 'Pizza', 'Tacos']
    },
    {
      name: 'favoriteColor',
      type: FieldType.SELECTDROPDOWN,
      options: ['Red', 'Blue', 'Yellow']
    }*/
  ];

  constructor(private dynamicReactiveFormService:  DynamicReactiveFormService) { }

  ngOnInit(): void {

    this.dynamicReactiveFormService.formData$.subscribe(formData => {
      this.formData = formData;
    })

  }

  extractFormValues(form: any): KeyValuePair[] {
    /**
     * Extract Form Field Names and Values into an array of key value pairs
     */
    const formValues: any[] = [];
    if (form.controls) {
      Object.keys(form.controls).forEach(key => {
        if (form.controls[key].controls) {
          formValues.push({ key, value: this.extractFormValues(form.controls[key])});
        } else {
          formValues.push({ key, value: form.get(key).value });
        }
      });
    }
    return formValues;
  }


}
