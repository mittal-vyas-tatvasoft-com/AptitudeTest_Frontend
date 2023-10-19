import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export interface Stream {
  name: string;
}

@Component({
  selector: 'app-add-degree',
  templateUrl: './add-degree.component.html',
  styleUrls: ['./add-degree.component.scss']
})
export class AddDegreeComponent {
  optionsList: string[] = ['Option 1', 'Option 2', 'Option 3'];

  constructor(public dialogRef: MatDialogRef<AddDegreeComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  streams: Stream[] = [{ name: 'Science' }];

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.streams.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Stream): void {
    const index = this.streams.indexOf(fruit);

    if (index >= 0) {
      this.streams.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  edit(fruit: Stream, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.streams.indexOf(fruit);
    if (index >= 0) {
      this.streams[index].name = value;
    }
  }
}
