import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Data, Felter } from 'src/app/form/models/data.model';
import { Field } from './dynamic-reactive-form.model';

@Injectable({
  providedIn: 'root',
})
export class DynamicReactiveFormService {
  fieldset: Field[] = [];

  formDataSource = new Subject<any>();
  formData$ = this.formDataSource.asObservable();

  fieldsetSource = new Subject<Field[]>()
  fieldset$ = this.fieldsetSource.asObservable();

  fieldChildrenSource = new Subject<Field[]>()
  fieldChildren$ = this.fieldChildrenSource.asObservable();

  private existingUsernames = ['Edison'];

  constructor(private http: HttpClient) {}

  getDynamicFormData(): Observable<Data[]> {
    return this.http.get<Data[]>('/assets/data.json');
  }

  getFieldsForGroup(groupName: string): Observable<Felter[]> {
   return this.getDynamicFormData().pipe(map((formData) => {
       return formData.filter(group => group.Gruppe.toLowerCase() === groupName.toLowerCase())[0].Felter;
    }));
  }

  updateFieldset(targetField: Field): void {
    this.fieldset = this.fieldset.filter(field => field.name.toLowerCase() !== targetField.name.toLowerCase());
    this.fieldset.push(targetField);

    this.fieldsetSource.next(this.fieldset);
  }

  formDataChanged(data: Data): void {
    this.formDataSource.next(data);
  }

  
  getValidator(value: string): Observable<boolean>{
    return of(this.existingUsernames.some((a) => a === value)).pipe(
      delay(1000)
    );
  }
  createValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.getValidator(control.value)
        .pipe(
          map((result: boolean) => { 
            return result ? { usernameAlreadyExists: true } : null
          }
          ))
    };
  }
}
