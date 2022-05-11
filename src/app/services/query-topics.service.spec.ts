import { TestBed } from '@angular/core/testing';

import { QueryTopicsService } from './query-topics.service';

describe('QueryTopicsService', () => {
  let service: QueryTopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryTopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
