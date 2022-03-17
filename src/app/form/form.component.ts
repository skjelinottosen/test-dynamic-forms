import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { KeyValuePair } from 'lib/dynamic-reactive-form.model';
import { DynamicReactiveFormService } from 'lib/dynamic-reactive-form.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Data } from './models/data.model';
import { map, tap, takeUntil} from 'rxjs/operators';
import { FormService } from './form.service';

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
  DIVIDER,
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
  asyncValidation?: AsyncValidatorFn[];
  visible?: boolean;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnDestroy {
  public formData!: FormGroup;

  public control!: FormControl;
  public FieldType = FieldType;

  form$ = new BehaviorSubject<Field[]>([]);
  form: Field[] = [
  /* {
     name: 'GLN',
      type: FieldType.TEXTFIELD,
    },

    {
      name: 'Date',
      type: FieldType.DATEPICKER,
    },

    

 
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
    }
    */
  ];

  unsubscribe$ = new Subject();

  constructor(
    private dynamicReactiveFormService: DynamicReactiveFormService,
    private http: HttpClient,
    private formService: FormService
  ) {
    
  }

  ngOnInit(): void {

    this.http.get<Data[]>('/assets/data.json').pipe(takeUntil(this.unsubscribe$)).subscribe((json: Data[]) => {
      const fields = [];


      const packageLevels = json.map((data) => {
        return data.Gruppe;
      });
        //Test
        fields.push({
          name: 'Pakning',
          type: FieldType.SELECTDROPDOWN,
          options: packageLevels,
        });


        json.forEach(data => {
          data.Felter.forEach(field => {
            fields.push( {
              name: field.Feltnavn,
              type: FieldType.TEXTFIELD,
              validation: [ Validators.required],
              asyncValidation: [ this.createValidator()]
            });
        });
      })
      
      this.form = [];
   this.form = [...fields];
   this.form$.next(this.form);
      

  });

  this.dynamicReactiveFormService.formData$.subscribe((formData) => {
    this.formData = formData;
  });
 
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete
  }


  createValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.formService
        .getValidator(control.value)
        .pipe(
          map((result: boolean) => { 
            return result ? { usernameAlreadyExists: true } : null
          }
          ))
    };
  }

  extractFormValues(form: any): KeyValuePair[] {
    /**
     * Extract Form Field Names and Values into an array of key value pairs
     */
    const formValues: any[] = [];
    if (form.controls) {
      Object.keys(form.controls).forEach((key) => {
        if (form.controls[key].controls) {
          formValues.push({
            key,
            value: this.extractFormValues(form.controls[key]),
          });
        } else {
          formValues.push({ key, value: form.get(key).value });
        }
      });
    }
    return formValues;
  }
}
