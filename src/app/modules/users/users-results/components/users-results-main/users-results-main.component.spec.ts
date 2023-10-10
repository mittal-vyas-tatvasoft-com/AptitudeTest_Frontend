import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersResultsMainComponent } from './users-results-main.component';

describe('UsersResultsMainComponent', () => {
  let component: UsersResultsMainComponent;
  let fixture: ComponentFixture<UsersResultsMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersResultsMainComponent]
    });
    fixture = TestBed.createComponent(UsersResultsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
