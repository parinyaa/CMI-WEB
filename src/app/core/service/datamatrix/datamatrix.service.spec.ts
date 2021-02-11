import { TestBed } from '@angular/core/testing';

import { DatamatrixService } from './datamatrix.service';

describe('DatamatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatamatrixService = TestBed.get(DatamatrixService);
    expect(service).toBeTruthy();
  });
});
