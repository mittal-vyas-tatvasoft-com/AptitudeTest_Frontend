import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGroupComponent } from './test-group.component';

describe('TestGroupComponent', () => {
  let component: TestGroupComponent;
  let fixture: ComponentFixture<TestGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestGroupComponent]
    });
    fixture = TestBed.createComponent(TestGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
