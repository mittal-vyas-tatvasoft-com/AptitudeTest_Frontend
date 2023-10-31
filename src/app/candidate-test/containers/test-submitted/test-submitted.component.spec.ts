import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSubmittedComponent } from './test-submitted.component';

describe('TestSubmittedComponent', () => {
  let component: TestSubmittedComponent;
  let fixture: ComponentFixture<TestSubmittedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestSubmittedComponent]
    });
    fixture = TestBed.createComponent(TestSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
