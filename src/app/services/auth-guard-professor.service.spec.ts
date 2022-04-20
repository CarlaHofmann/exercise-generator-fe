import { TestBed } from '@angular/core/testing';

import { AuthGuardProfessorService } from './auth-guard-professor.service';

describe('AuthGuardProfessorService', () => {
  let service: AuthGuardProfessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardProfessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
