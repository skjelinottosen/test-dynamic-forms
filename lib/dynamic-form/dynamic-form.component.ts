import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Field, KeyValuePair } from 'lib/dynamic-reactive-form.model';
import { DynamicReactiveFormService } from 'lib/dynamic-reactive-form.service';
import { BehaviorSubject } from 'rxjs';
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
  selector: 'lib-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() fieldset$ = new BehaviorSubject<Field[]>([]); // Required
  @Input() fieldset: Field[] = [];
  @Input() errors: Error[] = []; // Optional
  @Input() prefillData: KeyValuePair[] = []; // Optional (default values)
  @Input() readOnly = false; // Optional

  public form!: FormGroup;
  public formReady = false;

  private togglesWithChildren: {
    name: string;
    value: boolean;
    children: Field[];
  }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dynamicReactiveFormService: DynamicReactiveFormService
  ) {}

  ngOnInit(): void {
    this.dynamicReactiveFormService.fieldset$.subscribe((fieldset) => {
      this.fieldset$.next(fieldset);
    });

    this.fieldset$.subscribe((fieldSet) => {
      this.fieldset = fieldSet;
      if (this.fieldset) {
        this.initializeForm();

        this.form.valueChanges.subscribe((data) => {
          this.dynamicReactiveFormService.formDataChanged(data);
        });
      } else {
        console.warn('Please pass a fieldset into the dynamic form component.');
      }
    });
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({});
    this.fieldset.forEach((field) => {
      this.form.addControl(field.name, this.initializeFormControl(field));

      if (field.children) {
        field.children.forEach((child) => {
          this.form.addControl(child.name, this.initializeFormControl(child));
        });
      }
    });

    this.formReady = true;
  }

  initializeFormControl(field: any): FormControl {
    let value;

    if (typeof field.defaultValue !== 'undefined') {
      value = field.defaultValue;
    }

    if (field.type === 5) {
      if (typeof value === 'undefined') {
        value = true;
      }

      if (field.defaultValue === false) {
        //this.hideChildren(field);
      }
    }

    if (this.prefillData) {
      const defaultValue = this.prefillData.filter(
        (element, index) => element.key === field.name
      );
      if (defaultValue.length) {
        value = defaultValue[0].value;
      }
    }

    const validation = field.validation ? field.validation : [];
    const asyncValidation = field.asyncValidation ? field.asyncValidation : [];
    const isDisabled = field.disabled || this.readOnly ? true : false;

    return this.formBuilder.control(
      { value, disabled: isDisabled },
      validation,
      asyncValidation
    );
  }

  toggleChildren(name: string, toggleValue: boolean): void {
    const parentIndex = this.fieldset.findIndex((field) => field.name === name);
    if (toggleValue) {
      this.showChildren(parentIndex);
    } else {
      this.hideChildren(parentIndex);
    }
  }

  hideChildren(parentIndex: number): void {
    const parent = { ...this.fieldset[parentIndex] };
    parent?.children?.forEach((child, index) => {
      this.form?.get(child.name)?.disable();

      if (parent?.children) {
        parent.children[index].visible = false;
      }
    });
  }

  showChildren(parentIndex: number): void {
    const parent = { ...this.fieldset[parentIndex] };
    parent?.children?.forEach((child, index) => {
      this.form?.get(child.name)?.enable();
      if (parent?.children) {
        parent.children[index].visible = true;
      }
    });
  }
}
