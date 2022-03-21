import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormDataService {

  constructor(private http: HttpClient) { }

  getDynamicFormData(): Observable<Data[]> {
    return this.http.get<Data[]>('/assets/data.json');
  }
}
