import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTestTimeComponent } from './update-test-time.component';

describe('UpdateTestTimeComponent', () => {
  let component: UpdateTestTimeComponent;
  let fixture: ComponentFixture<UpdateTestTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTestTimeComponent]
    });
    fixture = TestBed.createComponent(UpdateTestTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
