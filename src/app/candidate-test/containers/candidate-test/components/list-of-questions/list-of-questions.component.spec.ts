import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfQuestionsComponent } from './list-of-questions.component';

describe('ListOfQuestionsComponent', () => {
  let component: ListOfQuestionsComponent;
  let fixture: ComponentFixture<ListOfQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfQuestionsComponent]
    });
    fixture = TestBed.createComponent(ListOfQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
