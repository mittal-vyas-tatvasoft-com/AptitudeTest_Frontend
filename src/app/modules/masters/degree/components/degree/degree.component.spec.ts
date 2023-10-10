import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeComponent } from './degree.component';

describe('DegreeComponent', () => {
  let component: DegreeComponent;
  let fixture: ComponentFixture<DegreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreeComponent]
    });
    fixture = TestBed.createComponent(DegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
