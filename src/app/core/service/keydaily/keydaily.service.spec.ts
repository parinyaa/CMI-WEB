import { TestBed } from '@angular/core/testing';

import { KeydailyService } from './keydaily.service';

describe('KeydailyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeydailyService = TestBed.get(KeydailyService);
    expect(service).toBeTruthy();
  });
});
