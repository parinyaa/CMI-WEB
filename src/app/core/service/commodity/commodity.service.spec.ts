import { TestBed } from '@angular/core/testing';

import { CommodityService } from './commodity.service';

describe('CommodityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommodityService = TestBed.get(CommodityService);
    expect(service).toBeTruthy();
  });
});
