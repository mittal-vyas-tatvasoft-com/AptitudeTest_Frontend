import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TechnologyService } from '../../services/technology.service';

@Component({
  selector: 'app-add-technology',
  templateUrl: './add-technology.component.html',
  styleUrls: ['./add-technology.component.scss']
})
export class AddTechnologyComponent {
  newTechnology = {
    name: '',
    description: '',
    isActive: false
  };

  constructor(
    public dialogRef: MatDialogRef<AddTechnologyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: TechnologyService
  ) {}

  get dialogTitle() {
    return this.data.dialogTitle;
  }

  get saveButtonText() {
    return this.data.saveButtonText;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.loginService.addTechnology(this.newTechnology).subscribe(
      (response: any) => {
        console.log('Technology created:', response);
        this.dialogRef.close({ refreshTable: this.data.refreshTable });
      },
      (error) => {
        console.error('Error creating technology:', error);
      }
    );
  }
}
