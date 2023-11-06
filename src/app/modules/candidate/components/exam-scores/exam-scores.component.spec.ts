import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamScoresComponent } from './exam-scores.component';

describe('ExamScoresComponent', () => {
  let component: ExamScoresComponent;
  let fixture: ComponentFixture<ExamScoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamScoresComponent]
    });
    fixture = TestBed.createComponent(ExamScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
