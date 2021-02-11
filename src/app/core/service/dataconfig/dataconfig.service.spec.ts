import { TestBed } from '@angular/core/testing';

import { DataconfigService } from './dataconfig.service';

describe('DataconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataconfigService = TestBed.get(DataconfigService);
    expect(service).toBeTruthy();
  });
});
