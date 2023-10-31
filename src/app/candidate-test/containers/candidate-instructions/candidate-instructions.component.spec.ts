import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInstructionsComponent } from './candidate-instructions.component';

describe('CandidateInstructionsComponent', () => {
  let component: CandidateInstructionsComponent;
  let fixture: ComponentFixture<CandidateInstructionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateInstructionsComponent]
    });
    fixture = TestBed.createComponent(CandidateInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
