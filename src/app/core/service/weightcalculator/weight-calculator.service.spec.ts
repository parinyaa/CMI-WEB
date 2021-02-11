import { TestBed } from '@angular/core/testing';

import { WeightCalculatorService } from './weight-calculator.service';

describe('WeightCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeightCalculatorService = TestBed.get(WeightCalculatorService);
    expect(service).toBeTruthy();
  });
});
