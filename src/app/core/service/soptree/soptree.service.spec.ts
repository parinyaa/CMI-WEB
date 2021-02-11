import { TestBed } from '@angular/core/testing';

import { SoptreeService } from './soptree.service';

describe('SoptreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoptreeService = TestBed.get(SoptreeService);
    expect(service).toBeTruthy();
  });
});
