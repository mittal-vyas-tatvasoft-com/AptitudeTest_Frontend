import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() color: ThemePalette = 'primary';
  @Input() type = 'button';
  @Input() isDisabled = false;
  @Input() label!: string;
  @Input() class = '';
  @Input() toolTipText: string;
  @Output() btnClick = new EventEmitter<Event>();

  onClick(event: Event) {
    this.btnClick.emit(event);
  }
}
