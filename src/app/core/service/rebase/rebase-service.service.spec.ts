import { TestBed } from '@angular/core/testing';

import { RebaseServiceService } from './rebase-service.service';

describe('RebaseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RebaseServiceService = TestBed.get(RebaseServiceService);
    expect(service).toBeTruthy();
  });
});
