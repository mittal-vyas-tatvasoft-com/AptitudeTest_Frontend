import { TestBed } from '@angular/core/testing';

import { UserImporterService } from './user-importer.service';

describe('UserImporterService', () => {
  let service: UserImporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserImporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
