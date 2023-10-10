import { TestBed } from '@angular/core/testing';

import { UsersResultsService } from './users-results.service';

describe('UsersResultsService', () => {
  let service: UsersResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
