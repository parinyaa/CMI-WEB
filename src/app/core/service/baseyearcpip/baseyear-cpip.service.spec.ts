import { TestBed } from '@angular/core/testing';

import { BaseyearCpipService } from './baseyear-cpip.service';

describe('BaseyearCpipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseyearCpipService = TestBed.get(BaseyearCpipService);
    expect(service).toBeTruthy();
  });
});
