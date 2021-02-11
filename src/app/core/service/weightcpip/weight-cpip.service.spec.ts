import { TestBed } from '@angular/core/testing';

import { WeightCpipService } from './weight-cpip.service';

describe('WeightCpipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeightCpipService = TestBed.get(WeightCpipService);
    expect(service).toBeTruthy();
  });
});
