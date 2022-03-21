import { TestBed } from '@angular/core/testing';

import { DynamicFormDataService } from './dynamic-form-data.service';

describe('DynamicFormDataService', () => {
  let service: DynamicFormDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFormDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
