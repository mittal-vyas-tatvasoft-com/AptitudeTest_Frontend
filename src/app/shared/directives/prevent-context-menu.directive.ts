import { Directive, HostListener, Input } from '@angular/core';
import { LoginService } from 'src/app/core/auth/services/login.service';

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
    }
  }
}
