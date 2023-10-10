import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImporterComponent } from './user-importer.component';

describe('UserImporterComponent', () => {
  let component: UserImporterComponent;
  let fixture: ComponentFixture<UserImporterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserImporterComponent]
    });
    fixture = TestBed.createComponent(UserImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
