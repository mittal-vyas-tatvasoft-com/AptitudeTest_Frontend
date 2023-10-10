import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOnlineComponent } from './users-online.component';

describe('UsersOnlineComponent', () => {
  let component: UsersOnlineComponent;
  let fixture: ComponentFixture<UsersOnlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersOnlineComponent]
    });
    fixture = TestBed.createComponent(UsersOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
