import { TestBed } from '@angular/core/testing';

import { BaseyearService } from './baseyear.service';

describe('BaseyearService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseyearService = TestBed.get(BaseyearService);
    expect(service).toBeTruthy();
  });
});
