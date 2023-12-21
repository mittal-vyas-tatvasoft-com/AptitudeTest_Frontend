import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordActionComponent } from './change-password-action.component';

describe('ChangePasswordActionComponent', () => {
  let component: ChangePasswordActionComponent;
  let fixture: ComponentFixture<ChangePasswordActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordActionComponent]
    });
    fixture = TestBed.createComponent(ChangePasswordActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
