import { TestBed } from '@angular/core/testing';

import { PpitreeService } from './ppitree.service';

describe('PpitreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PpitreeService = TestBed.get(PpitreeService);
    expect(service).toBeTruthy();
  });
});
