import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectAuthEdGuard } from './redirect-auth-ed.guard';

describe('redirectAuthEdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectAuthEdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
