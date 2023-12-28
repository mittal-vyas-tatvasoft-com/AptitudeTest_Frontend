import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScreenshotsComponent } from './view-screenshots.component';

describe('ViewScreenshotsComponent', () => {
  let component: ViewScreenshotsComponent;
  let fixture: ComponentFixture<ViewScreenshotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewScreenshotsComponent]
    });
    fixture = TestBed.createComponent(ViewScreenshotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
