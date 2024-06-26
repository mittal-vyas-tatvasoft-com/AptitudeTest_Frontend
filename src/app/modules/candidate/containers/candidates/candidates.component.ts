import { group } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ChangePasswordActionComponent } from 'src/app/core/auth/components/change-password-action/change-password-action.component';
import { AddCollegeComponent } from 'src/app/modules/masters/college/components/add-college/add-college.component';
import {
  Numbers,
  StaticMessages,
  StatusCode,
} from 'src/app/shared/common/enums';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import {
  CandidateModel,
  DropdownItem,
  ExportCandidatesParams,
  GetAllCandidateParams,
} from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'],
})
export class CandidatesComponent implements OnInit {
  optionsList: number[] = [];
  pageSize = Numbers.Ten;
  currentPageIndex = Numbers.Zero;
  totalItemsCount: number;
  pageNumbers: number[] = [];
  colleges: DropdownItem[] = [];
  groups: DropdownItem[] = [];
  checkRows = false;
  searchCandidate: string;
  sortKey: string;
  sortDirection: string;
  selectedGroup: DropdownItem | undefined | null;
  selectedCollege: DropdownItem | undefined | null;
  statusValue: boolean;
  selectedYear: number | null = null;
  dataSource: MatTableDataSource<CandidateModel>;
  columns: TableColumn<CandidateModel>[] = [
    { columnDef: 'select', header: '', width: '5%' },
    { columnDef: 'name', header: 'Name', width: '15%' },
    { columnDef: 'collegeName', header: 'College', width: '15%' },
    { columnDef: 'groupName', header: 'Group', width: '15%' },
    { columnDef: 'email', header: 'Email ID', width: '20%' },
    { columnDef: 'phoneNumber', header: 'Contact No.', width: '10%' },
    { columnDef: 'createdYear', header: 'Year Added', width: '5%' },
    { columnDef: 'isImported', header: 'Is Imported', width: '5%' },
    { columnDef: 'status', header: 'Status', width: '10%' },
    { columnDef: 'action', header: 'Action', isAction: true, width: '5%' },
  ];
  private ngUnsubscribe$: Subject<void> = new Subject();
  @ViewChild('myTable') myTable: TableComponent<any>;
  private searchSubject = new Subject<string>();

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<CandidateModel>([]);
    this.setupSearchObservable();
    this.getDropdowns();
    this.fetchCandidate();
  }

  exportData() {
    const searchQuery = this.searchCandidate;
    const collegeId = this.selectedCollege ? this.selectedCollege.id : null;
    const groupId = this.selectedGroup ? this.selectedGroup.id : null;
    const year = this.selectedYear ?? null;
    const params: ExportCandidatesParams = {
      currentPageIndex: this.currentPageIndex,
      pageSize: this.pageSize,
      searchQuery: searchQuery,
      collegeId: collegeId,
      groupId: groupId,
      year: year,
      sortField: this.sortKey,
      sortOrder: this.sortDirection,
    };
    this.candidateService.getExportData(params).subscribe({
      next: (res) => {
        if (res.statusCode == StatusCode.Success) {
          if (res.data.length > 0) {
            let data = this.candidateService.mapExportData(res.data);
            this.candidateService.downloadExcel(data);
            this.snackbarService.success(res.message);
          }
        } else {
          this.snackbarService.error(res.message);
        }
      },
      error: (error) => {
        this.snackbarService.error(error.message);
      },
    });
  }

  fetchCandidate() {
    const searchQuery = this.searchCandidate;
    const collegeId = this.selectedCollege ? this.selectedCollege.id : null;
    const groupId = this.selectedGroup ? this.selectedGroup.id : null;
    const year = this.selectedYear ?? null;
    const params: GetAllCandidateParams = {
      currentPageIndex: this.currentPageIndex,
      pageSize: this.pageSize,
      searchQuery: searchQuery,
      collegeId: collegeId,
      groupId: groupId,
      status: null,
      year: year,
      sortField: this.sortKey,
      sortOrder: this.sortDirection,
    };
    this.candidateService.getCandidate(params).subscribe((data: any) => {
      let i = 0;
      data.forEach(
        (candidate: {
          name: string;
          firstName: string;
          lastName: string;
          isImported: string;
        }) => {
          candidate.name = `${candidate.firstName} ${candidate.lastName || ''}`;
          if (data[i].isImported) {
            candidate.isImported = 'Yes';
          } else {
            candidate.isImported = 'No';
          }
          i = i + 1;
        }
      );
      this.dataSource = new MatTableDataSource<CandidateModel>(data);
      if (data && data.length > 0) {
        this.totalItemsCount = data[0].totalRecords;
      }
    });
  }

  private setupSearchObservable() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(async () => this.fetchCandidate())
      )
      .subscribe();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchCandidate);
  }

  onFilterChange() {
    this.fetchCandidate();
  }

  getDropdowns() {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.optionsList.push(year);
    }

    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges = colleges;
    });

    this.candidateService.getGroupsForDropDown().subscribe((groupList) => {
      groupList.forEach((group) => {
        if (group.isDefault) {
          const defaultGroupName = group.name + ' (Default Group) ';
          this.groups.push({ name: defaultGroupName, id: group.id });
        }
      });
      groupList.forEach((group) => {
        if (!group.isDefault) {
          this.groups.push({ name: group.name, id: group.id });
        }
      });
      this.activatedRoute.params.subscribe((res) => {
        if (res['groupId'] != undefined && res['collegeId'] == undefined) {
          this.selectedGroup = this.groups.find((x) => x.id == +res['groupId']);
          this.fetchCandidate();
        } else if (res['groupId'] != undefined && res['collegeId'] != 0) {
          this.selectedGroup = this.groups.find((x) => x.id == +res['groupId']);
          this.selectedCollege = this.colleges.find(
            (x) => x.id == +res['collegeId']
          );
          this.fetchCandidate();
        } else {
          this.selectedGroup = this.groups[0];
          this.selectedCollege = null;
          this.fetchCandidate();
        }
      });
    });
  }

  clearFilters() {
    this.searchCandidate = '';
    this.selectedGroup = null;
    this.selectedCollege = null;
    this.selectedYear = null;

    this.fetchCandidate();
  }

  handleAddCandidateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.width = '800px';
    const dialogRef = this.dialog.open(AddCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.refreshTable === true) {
        if (result.status == StatusCode.Success) {
          this.fetchCandidate();
          this.snackbarService.success(result.message);
        } else {
          this.snackbarService.error(result.message);
        }
      }
    });
  }

  handleDeleteSelected() {
    const data = this.myTable.getSelectedRowIds();
    if (data && data.length > 0) {
      const userIds = data.map((row: { userId: number }) => row.userId);
      this.handleDeleteCandidateDialog(userIds);
      this.myTable.selection.clear();
    } else {
      this.snackbarService.warn(StaticMessages.SelectRow);
    }
  }

  handleActiveInactiveSelected(status: boolean) {
    const data = this.myTable.getSelectedRowIds();
    if (data && data.length > 0) {
      const userIds = data.map((row: { userId: number }) => row.userId);
      this.updateStatus(userIds, status);
      this.myTable.selection.clear();
    } else {
      this.snackbarService.warn(StaticMessages.SelectRow);
    }
  }

  handleAddCollegeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddCollegeComponent, dialogConfig);
  }

  getDeleteCandidateDialog(id: number) {
    const idArray: number[] = [id];
    this.handleDeleteCandidateDialog(idArray);
  }

  handleDeleteCandidateDialog(id: number[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef?.afterClosed().subscribe((result: any) => {
      if (result) {
        this.candidateService.deleteCandidate(id).subscribe({
          next: (res: any) => {
            if (res.statusCode == StatusCode.Success) {
              this.fetchCandidate();
              this.snackbarService.success(res.message);
            } else {
              this.snackbarService.error(res.message);
            }
          },
        });
      }
    });
  }

  changePassword(data: any) {
    const email = data.email;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog
      .open(ChangePasswordActionComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data != null) {
          this.candidateService
            .ChangeUserPasswordByAdmin(email, data.passwordField)
            .subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
        }
      });
  }

  importCandidates() {
    this.router.navigate(['admin/candidate/import-candidate']);
  }

  handleEditCandidate(candidate: CandidateModel) {
    this.router.navigate(['admin/candidate/edit', candidate.id]);
  }

  getupdateStatus(id: number, newStatus: boolean) {
    const idArray: number[] = [id];
    this.updateStatus(idArray, newStatus);
  }

  updateStatus(id: number[], newStatus: boolean): void {
    this.candidateService.updateStatus(id, newStatus).subscribe({
      next: (res: any) => {
        if (res.statusCode == StatusCode.Success) {
          this.fetchCandidate();
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageIndex = Numbers.Zero;
    this.fetchCandidate();
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.fetchCandidate();
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.fetchCandidate();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'name':
        this.sortKey = 'FirstName';
        this.sortDirection = event.direction;
        break;

      case 'collegeName':
        this.sortKey = 'CollegeName';
        this.sortDirection = event.direction;
        break;

      case 'groupName':
        this.sortKey = 'GroupName';
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

      case 'createdYear':
        this.sortKey = 'CreatedYear';
        this.sortDirection = event.direction;
        break;

      case 'isImported':
        this.sortKey = 'IsImported';
        this.sortDirection = event.direction;
        break;

      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }
    this.fetchCandidate();
  }
}
