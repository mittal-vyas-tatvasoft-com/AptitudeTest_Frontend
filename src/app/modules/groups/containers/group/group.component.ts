import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  Numbers,
  StaticMessages,
  StatusCode,
} from 'src/app/shared/common/enums';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { GroupsModel } from '../../interfaces/groups.interface';
import { GroupsService } from '../../services/groups.service';
import { AddGroupComponent } from '../add-group/add-group.component';
import { CollegeModel } from 'src/app/modules/masters/college/interfaces/college.interface';
import { debounceTime, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  groupList: GroupsModel[] = [];
  colleges: CollegeModel[];
  filteredGroupList: GroupsModel[];
  groupIds: number[] = [];
  addGroup: GroupsModel = {
    id: 0,
    name: '',
    numberOfStudentsInGroup: 0,
    isDefault: false,
    collegesUnderGroup: [],
  };
  private searchGroupChanged = new Subject<string>();
  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    private groupsService: GroupsService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getGroups();
    this.searchGroupChanged
      .pipe(debounceTime(Numbers.Debounce))
      .subscribe(() => {
        this.getFilteredGroups();
      });
  }

  getGroupsByFiltering(value: string) {
    this.searchGroupChanged.next(value);
  }

  createForm() {
    this.form = this.fb.group({
      searchedGroup: [''],
      searchedCollege: [''],
    });
  }

  getGroups() {
    this.groupsService.groups().subscribe((groups) => {
      this.groupList = groups;
    });
  }

  deleteMultipleGroups() {
    if (this.groupIds.length > 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['confirmation-dialog'];
      dialogConfig.autoFocus = false;
      const dialogRef = this.dialog.open(
        DeleteConfirmationDialogComponent,
        dialogConfig
      );
      dialogRef?.afterClosed().subscribe((result: any) => {
        if (result) {
          this.groupsService.deleteMultiple(this.groupIds).subscribe({
            next: (res: any) => {
              if (res.statusCode == StatusCode.Success) {
                this.groupIds = [];
                this.getGroups();
                this.snackbarService.success(res.message);
              } else {
                this.snackbarService.error(res.message);
              }
            },
          });
        }
      });
    } else {
      this.snackbarService.warn(StaticMessages.SelectCard);
    }
  }
  handleSelectedGroups(id: number) {
    const groupExists = this.groupIds.includes(id);
    if (groupExists) {
      const index = this.groupIds.indexOf(id);
      this.groupIds.splice(index, 1);
    } else {
      this.groupIds.push(id);
    }
  }

  getFilteredGroups() {
    const search = this.form.get('searchedGroup')?.value;
    const collegeId = this.form.get('searchedCollege')?.value;
    this.groupsService.groups(search, collegeId).subscribe((groups) => {
      this.groupList = groups;
    });
  }

  handleAddGroupDialog(data: GroupsModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.width = '556px';
    dialogConfig.data = data;
    this.dialog
      .open(AddGroupComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data != null) {
          if (data.id == 0) {
            this.groupsService.create(data).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.getGroups();
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          } else {
            this.groupsService.update(data).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.getFilteredGroups();
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

  handleDeleteGroupDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(DeleteConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.groupsService.delete(id).subscribe({
            next: (res) => {
              if (res.statusCode == StatusCode.Success) {
                this.snackbarService.success(res.message);
                this.groupIds = [];
                this.getGroups();
              } else {
                this.snackbarService.error(res.message);
              }
            },
          });
        }
      });
  }

  setGroupAsDefault(group: GroupsModel) {
    group.isDefault = true;
    this.groupsService.update(group).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.getFilteredGroups();
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  clearSearchAndFilter() {
    this.getGroups();
    this.form.get('searchedGroup')?.setValue('');
    this.form.get('searchedCollege')?.setValue('');
  }
}
