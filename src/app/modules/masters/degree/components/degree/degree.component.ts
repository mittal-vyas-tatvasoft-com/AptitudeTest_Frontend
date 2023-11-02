import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddDegreeComponent } from '../add-degree/add-degree.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DegreeService } from '../../services/degree.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { StatusCode } from 'src/app/shared/common/enums';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { DegreeModel } from '../../interfaces/degree.interface';

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
  displayedColumns: TableColumn<DegreeModel>[] = [
    { columnDef: 'name', header: 'Degree Name' },
    { columnDef: 'level', header: 'Degree Level' },
    { columnDef: 'streams', header: 'Stream' },
    { columnDef: 'status', header: 'Status' },
    {
      columnDef: 'editAction',
      header: 'Action',
      isAction: true,
      action: 'edit',
    },
  ];
  addDegree: DegreeModel = {
    id: 0,
    name: '',
    status: true,
    level: 0,
    streams: [],
  };
  dataSource!: MatTableDataSource<DegreeModel>;
  degreeData: any;
  constructor(
    public dialog: MatDialog,
    private degreeService: DegreeService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllDegrees();
  }

  getAllDegrees() {
    this.degreeService.degrees().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response.data);
      this.degreeData = response.data;
    });
  }

  handleAddDegreeDialog(data: DegreeModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = data.id;
    this.dialog
      .open(AddDegreeComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data != null) {
          if (data.id == 0) {
            this.degreeService.create(data).subscribe({
              next: (res: any) => {
                if (res.statusCode == StatusCode.Success) {
                  this.getAllDegrees();
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          } else {
            this.degreeService.update(data).subscribe({
              next: (res: any) => {
                if (res.statusCode == StatusCode.Success) {
                  this.snackbarService.success(res.message);
                  this.getAllDegrees();
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          }
        }
      });
  }

  handleDeleteDegreeDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.degreeService.delete(id).subscribe({
            next: (res: any) => {
              if (res.statusCode == StatusCode.Success) {
                this.snackbarService.success(res.message);
                this.getAllDegrees();
              } else {
                this.snackbarService.error(res.message);
              }
            },
          });
          this.degreeData = this.degreeData.filter(
            (data: any) => data.id != id
          );
          this.dataSource = new MatTableDataSource(this.degreeData);
        }
      });
  }

  updateStatus(id: number, newStatus: boolean): void {
    let status: UpdateStatus = {
      id: id,
      status: newStatus,
    };

    this.degreeService.updateStatus(status).subscribe((res: any) => {
      if (res.statusCode == StatusCode.Success) {
        this.getAllDegrees();
        this.snackbarService.success(res.message);
      } else {
        this.snackbarService.error(res.message);
      }
    });
  }
}
