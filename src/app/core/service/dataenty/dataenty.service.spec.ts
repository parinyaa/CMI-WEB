import { TestBed } from '@angular/core/testing';

import { DataEntyService } from './dataenty.service';

describe('DataentyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataEntyService = TestBed.get(DataEntyService);
    expect(service).toBeTruthy();
  });
});
