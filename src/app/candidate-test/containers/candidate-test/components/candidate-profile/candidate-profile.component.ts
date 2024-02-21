import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss'],
})
export class CandidateProfileComponent {
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'F12' || event.keyCode === 123) {
      event.preventDefault();
    }
  }

  preventRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
}
