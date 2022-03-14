import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicReactiveFormService {

  formDataSource = new Subject<any>();
  formData$ = this.formDataSource.asObservable();

  constructor() { }

  formDataChanged(data: any): void {
    this.formDataSource.next(data);
  }


}
