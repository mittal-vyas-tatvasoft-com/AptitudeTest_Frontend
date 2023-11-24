import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestQuestionsComponent } from './add-test-questions.component';

describe('AddTestQuestionsComponent', () => {
  let component: AddTestQuestionsComponent;
  let fixture: ComponentFixture<AddTestQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTestQuestionsComponent]
    });
    fixture = TestBed.createComponent(AddTestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
