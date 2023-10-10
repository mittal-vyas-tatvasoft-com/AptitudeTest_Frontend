import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImporterMainComponent } from './user-importer-main.component';

describe('UserImporterMainComponent', () => {
  let component: UserImporterMainComponent;
  let fixture: ComponentFixture<UserImporterMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserImporterMainComponent]
    });
    fixture = TestBed.createComponent(UserImporterMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
