import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Field } from 'lib/dynamic-reactive-form.model';
import { DynamicReactiveFormService } from 'lib/dynamic-reactive-form.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Data } from './models/data.model';
import { takeUntil } from 'rxjs/operators';

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
  form: Field[] = [];

  unsubscribe$ = new Subject();

  constructor(
    private dynamicReactiveFormService: DynamicReactiveFormService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.http
      .get<Data[]>('/assets/data.json')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((json: Data[]) => {
        const fields: Field[] = [];

        const packageLevels = json.map((data) => {
          return data.Gruppe;
        });

        fields.push({
          name: 'Gruppe',
          type: FieldType.SELECTDROPDOWN,
          options: packageLevels,
          children: [],
        });

        this.form = [...fields];
        this.form$.next(this.form);
      });

    this.dynamicReactiveFormService.formData$.subscribe((formData) => {
      this.formData = formData;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete;
  }
}
