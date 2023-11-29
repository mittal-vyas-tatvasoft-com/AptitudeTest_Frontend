import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQuestionsListingComponent } from './test-questions-listing.component';

describe('TestQuestionsListingComponent', () => {
  let component: TestQuestionsListingComponent;
  let fixture: ComponentFixture<TestQuestionsListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestQuestionsListingComponent]
    });
    fixture = TestBed.createComponent(TestQuestionsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
