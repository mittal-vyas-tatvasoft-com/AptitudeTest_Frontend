import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddTopicsComponent } from '../add-topics/add-topics.component';


export interface TopicsData {
  name: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})

export class TopicsComponent {
  
  displayedColumns: string[] = ['name', 'status', 'action'];
  dataSource: MatTableDataSource<TopicsData>;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([
      { name: "Maths", status: "Active", action: "" },
      { name: "Reasoning", status: "Active", action: "" },
      { name: "Programing", status: "Active", action: "" },
      { name: "Technical", status: "Active", action: "" },
    ]);
  }

  handleAddTopicsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddTopicsComponent, dialogConfig);
  }
}
