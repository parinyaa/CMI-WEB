import { TestBed } from '@angular/core/testing';

import { AmphurService } from './amphur.service';

describe('AmphurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmphurService = TestBed.get(AmphurService);
    expect(service).toBeTruthy();
  });
});
