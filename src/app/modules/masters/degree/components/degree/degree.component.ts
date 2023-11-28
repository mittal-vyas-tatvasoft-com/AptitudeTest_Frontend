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
import { Sort } from '@angular/material/sort';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';

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
  sortKey = '';
  sortDirection = '';
  addDegree: DegreeModel = {
    id: 0,
    name: '',
    status: true,
    level: 0,
    streams: [],
  };
  dataSource!: MatTableDataSource<DegreeModel>;
  degreeData: DegreeModel[];
  constructor(
    public dialog: MatDialog,
    private degreeService: DegreeService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllDegrees();
  }

  getAllDegrees() {
    this.degreeService
      .degrees(this.sortKey, this.sortDirection)
      .subscribe((response: ResponseModel<DegreeModel[]>) => {
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
              next: (res: ResponseModel<null>) => {
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
              next: (res: ResponseModel<null>) => {
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
            next: (res: ResponseModel<null>) => {
              if (res.statusCode == StatusCode.Success) {
                this.snackbarService.success(res.message);
                this.getAllDegrees();
              } else {
                this.snackbarService.error(res.message);
              }
            },
          });
          this.degreeData = this.degreeData.filter(
            (data: DegreeModel) => data.id != id
          );
          this.dataSource = new MatTableDataSource(this.degreeData);
        }
      });
  }

  updateStatus(id: number, newStatus: boolean): void {
    const status: UpdateStatus = {
      id: id,
      status: newStatus,
    };

    this.degreeService
      .updateStatus(status)
      .subscribe((res: ResponseModel<number>) => {
        if (res.statusCode == StatusCode.Success) {
          this.getAllDegrees();
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      });
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'name':
        this.sortKey = 'Name';
        this.sortDirection = event.direction;
        break;

      case 'level':
        this.sortKey = 'Level';
        this.sortDirection = event.direction;
        break;

      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }
    this.getAllDegrees();
  }
}
