import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPreventContextMenu]',
})
export class PreventContextMenuDirective {
  @Input() appPreventContextMenu: boolean;
  isAdmin: boolean;
  constructor() {}
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    this.isAdmin = this.appPreventContextMenu;
    if (!this.isAdmin) {
      event.preventDefault();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.isAdmin = this.appPreventContextMenu;
    if (!this.isAdmin) {
      if (event.key === 'F12' || event.keyCode === 123) {
        event.preventDefault();
      }
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.key === 'I' || event.key === 'i')
      ) {
        event.preventDefault();
      }
    }
  }
}
