import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddDegreeComponent } from '../add-degree/add-degree.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DegreeService } from '../../services/degree.service';

export interface DegreeData {
  name: string;
  level: string;
  streams: string;
  status: string;
  action: string;
}

export interface UpdateStatus {
  id: number;
  status: boolean;
}

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss'],
})
export class DegreeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'level', 'stream', 'status', 'action'];
  dataSource!: MatTableDataSource<DegreeData>;
  degreeData: any;
  constructor(public dialog: MatDialog, private degreeService: DegreeService) {}

  ngOnInit(): void {
    this.getAllDegrees();
  }

  getAllDegrees() {
    this.degreeService.degrees().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response.data.entityList);
      this.degreeData = response.data.entityList;
    });
  }
  handleAddDegreeDialog(id: number) {
    this.degreeData.filter((data: any) => data.id == id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = id;
    this.dialog
      .open(AddDegreeComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data.id == 0) {
          debugger;
          this.degreeService.create(data).subscribe({
            next: (res: any) => {
              if (res.statusCode == 200) {
                this.getAllDegrees();
              }
            },
          });
        } else {
          this.degreeService.update(data).subscribe({
            next: (res: any) => {
              if (res.statusCode == 200) {
                this.getAllDegrees();
              }
            },
          });
        }
      });
  }

  handleDeleteProfileDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.degreeService.delete(id).subscribe({
            next: (res) => {},
          });
          this.degreeData = this.degreeData.filter(
            (data: any) => data.id != id
          );
          this.dataSource = new MatTableDataSource(this.degreeData);
        }
      });
  }

  onActiveClick(id: number) {
    let status: UpdateStatus = {
      id: id,
      status: true,
    };
    this.degreeService.updateStatus(status).subscribe((res) => {});
    this.degreeData = this.degreeData.map((data: any) => {
      if (data.id == id) {
        data.status = true;
      }
      return data;
    });
    this.dataSource = new MatTableDataSource(this.degreeData);
  }

  onInactiveClick(id: number) {
    let status: UpdateStatus = {
      id: id,
      status: false,
    };
    this.degreeService.updateStatus(status).subscribe((res) => {});
    this.degreeData = this.degreeData.map((data: any) => {
      if (data.id == id) {
        data.status = false;
      }
      return data;
    });
    this.dataSource = new MatTableDataSource(this.degreeData);
  }
}
