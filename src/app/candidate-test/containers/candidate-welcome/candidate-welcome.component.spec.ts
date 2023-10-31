import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateWelcomeComponent } from './candidate-welcome.component';

describe('CandidateWelcomeComponent', () => {
  let component: CandidateWelcomeComponent;
  let fixture: ComponentFixture<CandidateWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateWelcomeComponent]
    });
    fixture = TestBed.createComponent(CandidateWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
