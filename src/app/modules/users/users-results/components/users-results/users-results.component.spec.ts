import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersResultsComponent } from './users-results.component';

describe('UsersResultsComponent', () => {
  let component: UsersResultsComponent;
  let fixture: ComponentFixture<UsersResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersResultsComponent]
    });
    fixture = TestBed.createComponent(UsersResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
