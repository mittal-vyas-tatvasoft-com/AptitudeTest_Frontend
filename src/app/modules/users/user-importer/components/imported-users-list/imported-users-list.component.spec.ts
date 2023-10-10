import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedUsersListComponent } from './imported-users-list.component';

describe('ImportedUsersListComponent', () => {
  let component: ImportedUsersListComponent;
  let fixture: ComponentFixture<ImportedUsersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportedUsersListComponent]
    });
    fixture = TestBed.createComponent(ImportedUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
