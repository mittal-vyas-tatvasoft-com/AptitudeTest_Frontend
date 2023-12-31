import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime } from 'rxjs';
import { Numbers, StatusCode } from 'src/app/shared/common/enums';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { adminFilterFormConfig } from '../../configs/admin.configs';
import { AdminModel, SearchModel } from '../../interfaces/admin.interface';
import { AdminService } from '../../services/admin.service';
import { AddAdminComponent } from '../add-admin/add-admin.component';

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
  sortKey = '';
  sortDirection = '';
  optionsList: SelectOption[] = [
    { value: 'Select', id: '' },
    { value: 'Active', id: true },
    { value: 'Inactive', id: false },
  ];

  dataSource: MatTableDataSource<AdminModel>;
  AdminFilterFormConfigModel = adminFilterFormConfig;

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
    { columnDef: 'firstName', header: 'First Name', width: '20%' },
    { columnDef: 'lastName', header: 'Last Name', width: '20%' },
    { columnDef: 'email', header: 'Email', width: '25%' },
    { columnDef: 'phoneNumber', header: 'Phone Number', width: '15%' },
    { columnDef: 'status', header: 'Status', width: '10%' },
    {
      columnDef: 'editAction',
      header: 'Action',
      isAction: true,
      action: 'edit',
      width: '10%',
    },
  ];
  form: FormGroup;
  private searchInputValue = new Subject<SearchModel>();

  constructor(
    public dialog: MatDialog,
    private adminService: AdminService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<AdminModel>([]);
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      searchField: [''],
      statusField: [null],
    });
  }

  ngAfterViewInit(): void {
    this.fetchAdmin();

    this.searchInputValue
      .pipe(
        debounceTime(Numbers.Debounce) // Adjust the debounce time as needed
      )
      .subscribe(() => {
        this.fetchAdmin();
      });
  }

  searchAdmin() {
    const searchValue = this.form.get('searchField')?.value;
    const statusValue = this.form.get('statusField')?.value;
    const data: SearchModel = {
      searchValue: searchValue,
      statusValue: statusValue,
    };
    this.searchInputValue.next(data);
  }

  fetchAdmin() {
    const searchValue = this.form.get('searchField')?.value;
    const status = this.form.get('statusField')?.value;
    this.adminService
      .getAdmins(
        this.currentPageIndex,
        this.pageSize,
        searchValue,
        status,
        this.sortKey,
        this.sortDirection
      )
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
          this.form.get('searchField')?.setValue('');
          this.form.get('sortField')?.setValue('');
          this.fetchAdmin();
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
        if (res) {
          this.form.get('searchField')?.setValue('');
          this.form.get('sortField')?.setValue('');
          this.fetchAdmin();
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
              this.form.get('searchField')?.setValue('');
              this.form.get('sortField')?.setValue('');
              this.fetchAdmin();
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
    this.fetchAdmin();
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.fetchAdmin();
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.fetchAdmin();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }

  resetForm() {
    this.form.get('searchField')?.setValue('');
    this.form.get('statusField')?.setValue('');
    this.fetchAdmin();
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'firstName':
        this.sortKey = 'FirstName';
        this.sortDirection = event.direction;
        break;

      case 'lastName':
        this.sortKey = 'LastName';
        this.sortDirection = event.direction;
        break;

      case 'email':
        this.sortKey = 'Email';
        this.sortDirection = event.direction;
        break;

      case 'phoneNumber':
        this.sortKey = 'PhoneNumber';
        this.sortDirection = event.direction;
        break;

      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }
    this.fetchAdmin();
  }
}
