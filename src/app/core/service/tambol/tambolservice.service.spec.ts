import { TestBed } from '@angular/core/testing';

import { TambolserviceService } from './tambolservice.service';

describe('TambolserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TambolserviceService = TestBed.get(TambolserviceService);
    expect(service).toBeTruthy();
  });
});
