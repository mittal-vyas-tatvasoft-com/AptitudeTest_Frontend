import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersResultsStatisticsComponent } from './users-results-statistics.component';

describe('UsersResultsStatisticsComponent', () => {
  let component: UsersResultsStatisticsComponent;
  let fixture: ComponentFixture<UsersResultsStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersResultsStatisticsComponent]
    });
    fixture = TestBed.createComponent(UsersResultsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
