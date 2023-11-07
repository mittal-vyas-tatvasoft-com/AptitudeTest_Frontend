import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddAdminComponent } from '../add-admin/add-admin.component';
import { AdminService } from '../../services/admin.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AdminModel, searchModel } from '../../interfaces/admin.interface';
import { Subject, debounceTime } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Numbers, StatusCode } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-master-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  pageSize = Numbers.Ten;
  currentPageIndex = Numbers.Zero;
  totalItemsCount: number;
  pageNumbers: number[] = [];
  hasData: boolean;
  optionsList = [
    { key: 'Select', value: null },
    { key: 'Active', value: true },
    { key: 'InActive', value: false },
  ];
  dataSource: MatTableDataSource<AdminModel>;
  addAdmin: AdminModel = {
    id: Numbers.Zero,
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: Numbers.Zero,
    status: true,
  };
  columns: TableColumn<AdminModel>[] = [
    { columnDef: 'firstName', header: 'First Name' },
    { columnDef: 'lastName', header: 'Last Name' },
    { columnDef: 'email', header: 'Email' },
    { columnDef: 'phoneNumber', header: 'Phone Number' },
    { columnDef: 'status', header: 'Status' },
    {
      columnDef: 'editAction',
      header: 'Action',
      isAction: true,
      action: 'edit',
    },
  ];
  form: FormGroup;
  private searchInputValue = new Subject<searchModel>();

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<AdminModel>([]);
    this.fetchAdmin('', null);
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      searchField: [''],
      statusField: [null],
    });
  }

  ngAfterViewInit(): void {
    this.searchInputValue
      .pipe(
        debounceTime(Numbers.Debounce) // Adjust the debounce time as needed
      )
      .subscribe((value) => {
        this.fetchAdmin(value.searchValue, value.statusValue);
      });
  }

  searchAdmin() {
    const searchValue = this.form.get('searchField')?.value;
    const statusValue = this.form.get('statusField')?.value;
    const data: searchModel = {
      searchValue: searchValue,
      statusValue: statusValue,
    };
    this.searchInputValue.next(data);
  }

  fetchAdmin(searchValue: string | null, status: boolean | null) {
    this.adminService
      .getAdmins(this.currentPageIndex, this.pageSize, searchValue, status)
      .subscribe((res: any) => {
        // not possible to remove any type because it has sometime null and sometime object with data
        if (res.data.length > Numbers.Zero) {
          this.dataSource = new MatTableDataSource<AdminModel>(res.data);
          this.totalItemsCount = res.data[Numbers.Zero].totalRecords;
          this.hasData = true;
        } else {
          this.dataSource = new MatTableDataSource<AdminModel>(res.data);
          this.totalItemsCount = Numbers.Zero;
          this.hasData = false;
        }
      });
  }

  updateStatus(id: number, newStatus: boolean): void {
    this.adminService.updateStatus(id, newStatus).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          this.resetForm();
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  handleAddEditAdminDialog(data: AdminModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = data.id;

    this.dialog
      .open(AddAdminComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        console.log(res);

        const payload: AdminModel = {
          id: res.id,
          email: res.email,
          firstName: res.firstName,
          middleName: res.middleName,
          lastName: res.lastName,
          phoneNumber: res.phoneNumber,
          status: res.status,
        };
        if (res) {
          if (res.id == Numbers.Zero) {
            this.adminService.addNewAdmin(payload).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.resetForm();
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          } else {
            this.adminService.updateAdmin(payload).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.resetForm();
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

  handleDeleteAdminDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef?.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.deleteAdmin(id).subscribe({
          next: (res) => {
            if (res.statusCode == StatusCode.Success) {
              this.resetForm();
              this.snackbarService.success(res.message);
            } else {
              this.snackbarService.error(res.message);
            }
          },
        });
      }
    });
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageIndex = Numbers.Zero;
    this.fetchAdmin('', null);
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.fetchAdmin('', null);
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.fetchAdmin('', null);
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }

  resetForm() {
    this.form.reset();
    this.fetchAdmin('', null);
  }
}
