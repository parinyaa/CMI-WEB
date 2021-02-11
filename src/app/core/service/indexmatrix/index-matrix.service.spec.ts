import { TestBed } from '@angular/core/testing';

import { IndexMatrixService } from './index-matrix.service';

describe('IndexMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexMatrixService = TestBed.get(IndexMatrixService);
    expect(service).toBeTruthy();
  });
});
