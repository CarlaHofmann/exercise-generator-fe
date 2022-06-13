import {TestBed} from '@angular/core/testing';

import {ProfessorAuthGuard} from './professor-auth-guard.service';

describe('AuthGuardProfessorService', () => {
  let service: ProfessorAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessorAuthGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
