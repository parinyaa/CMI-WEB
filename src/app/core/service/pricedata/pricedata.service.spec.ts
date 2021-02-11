import { TestBed } from '@angular/core/testing';

import { PricedataService } from './pricedata.service';

describe('PricedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PricedataService = TestBed.get(PricedataService);
    expect(service).toBeTruthy();
  });
});
