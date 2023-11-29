import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextControlCharacterComponent } from './text-control-character.component';

describe('TextControlCharacterComponent', () => {
  let component: TextControlCharacterComponent;
  let fixture: ComponentFixture<TextControlCharacterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextControlCharacterComponent]
    });
    fixture = TestBed.createComponent(TextControlCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
