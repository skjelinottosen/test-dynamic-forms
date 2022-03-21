import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Field, FieldType } from '../dynamic-reactive-form.model';
import { DynamicReactiveFormService } from 'lib/dynamic-reactive-form.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'lib-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
})
export class DynamicFieldComponent implements OnInit {
  @Input() field$ = new BehaviorSubject<Field>({
    name: '',
    type: FieldType.TEXTFIELD,
  });
  @Input() field!: Field;
  public control!: FormControl;
  public FieldType = FieldType;
  public fieldModels!: any[];
  constructor(
    private formGroupDir: FormGroupDirective,
    public dynamicReactiveFormService: DynamicReactiveFormService
  ) {}

  ngOnInit(): void {
    /**
     * @angular/forms -> FormGroupDirective! 🎉
     *
     * https://angular.io/api/forms/FormGroupDirective
     * "Binds an existing FormGroup to a DOM element."
     *
     * We can easily access Reactive Forms functionality from this component in our
     * parent component without the need to pass our own inputs or event emitters.
     */
    this.control = this.formGroupDir.control.get(
      this.field.name
    ) as FormControl;
  }

  displayChildren(): void {
    this.field.children = [];
    const parentValue = this.control.value;
    if (parentValue) {
      this.dynamicReactiveFormService
        .getFieldsForGroup(parentValue)
        .subscribe((fields) => {
          fields.forEach((field) => {
            if (this.field.children) {
              this.field.children.push({
                parent: this.field.name,
                name: field.Feltnavn,
                type: FieldType.TEXTFIELD,
                disabled: false,
                visible: true,
                validation: [Validators.required],
                asyncValidation: [
                  this.dynamicReactiveFormService.createValidator(),
                ],
              });
            }
          });

          if (this.field.children) {
            this.dynamicReactiveFormService.updateFieldset(this.field);
          }
        });
    } else {
      this.field.children?.forEach((child) => {
        child.visible = false;
      });
    }
  }
}
