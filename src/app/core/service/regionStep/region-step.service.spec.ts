import { TestBed } from '@angular/core/testing';

import { RegionStepService } from './region-step.service';

describe('RegionStepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegionStepService = TestBed.get(RegionStepService);
    expect(service).toBeTruthy();
  });
});
