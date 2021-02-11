import { TestBed } from '@angular/core/testing';

import { WeightMappingService } from './weight-mapping.service';

describe('WeightMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeightMappingService = TestBed.get(WeightMappingService);
    expect(service).toBeTruthy();
  });
});
