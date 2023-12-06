import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StatusCode } from 'src/app/shared/common/enums';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { ProfileModel } from '../../interfaces/profile.interface';
import { ProfileService } from '../../services/profile.service';
import { AddProfileComponent } from '../add-profile/add-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  displayedColumns: TableColumn<ProfileModel>[] = [
    { columnDef: 'name', header: 'Profile Name', width: '50%' },
    { columnDef: 'status', header: 'Status', width: '25%' },
    {
      columnDef: 'editAction',
      header: 'Action',
      isAction: true,
      action: 'edit',
      width: '25%'
    },
  ];
  addProfile: ProfileModel = {
    id: 0,
    name: '',
    status: true,
  };
  sortKey = '';
  sortDirection = '';
  dataSource!: MatTableDataSource<any>;
  constructor(
    public dialog: MatDialog,
    private profileService: ProfileService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllProfileData();
  }

  getAllProfileData() {
    this.profileService
      .GetAllProfiles(this.sortKey, this.sortDirection)
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.data);
        },
      });
  }

  handleAddProfileDialog(data: ProfileModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = data.id;

    this.dialog
      .open(AddProfileComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.id == 0) {
            this.profileService.AddNewProfile(res).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.getAllProfileData();
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          } else {
            this.profileService.UpdateProfile(res).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.getAllProfileData();
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          }
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
      .subscribe((res) => {
        if (res == true) {
          this.profileService.DeleteProfile(id).subscribe({
            next: (res) => {
              if (res.statusCode == StatusCode.Success) {
                this.getAllProfileData();
                this.snackbarService.success(res.message);
              } else {
                this.snackbarService.error(res.message);
              }
            },
          });
        }
      });
  }

  changeSingleProfileStatus(id: number, status: boolean) {
    this.profileService.ChangeSingleProfileStatus(id, status).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.getAllProfileData();
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  handleDataSorting(event: Sort) {
    if (event.active == 'name') {
      this.sortKey = 'Name';
      this.sortDirection = event.direction;
    } else {
      this.sortKey = '';
      this.sortDirection = '';
    }
    
    this.getAllProfileData();
  }
}
