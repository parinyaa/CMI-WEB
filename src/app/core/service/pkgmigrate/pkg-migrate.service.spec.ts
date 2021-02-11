import { TestBed } from '@angular/core/testing';

import { PkgMigrateService } from './pkg-migrate.service';

describe('PkgMigrateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PkgMigrateService = TestBed.get(PkgMigrateService);
    expect(service).toBeTruthy();
  });
});
