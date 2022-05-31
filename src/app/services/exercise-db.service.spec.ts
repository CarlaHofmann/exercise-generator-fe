import { TestBed } from '@angular/core/testing';

import { ExerciseDbService } from './exercise-db.service';

describe('ExerciseDbService', () => {
  let service: ExerciseDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExerciseDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
