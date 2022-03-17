import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  private existingUsernames = ['Batman', 'Superman', 'Joker', 'Luthor'];
  
  getValidator(value: string): Observable<boolean>{
    return of(this.existingUsernames.some((a) => a === value)).pipe(
      delay(1000)
    );
  }
}
