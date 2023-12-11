import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { offCampusModeGuard } from './off-campus-mode.guard';

describe('offCampusModeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => offCampusModeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
