import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from 'src/app/modules/masters/college/components/add-college/add-college.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';
import { Router } from '@angular/router';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { CandidateService } from '../../services/candidate.service';
import { takeUntil, catchError, throwError, Subject } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { CandidateModel, DropdownItem } from '../../interfaces/candidate.interface';

export interface CandidateData {
  name: string;
  college: string;
  group: string;
  email: string;
  contact: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent {
  optionsList: string[] = ['Active', 'Inactive'];
  displayedColumns: string[] = ['select', 'name', 'college', 'group', 'email', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<CandidateModel>;
  pageSize = 10;
  colleges: DropdownItem[] = [];
  groups: DropdownItem[] = []
  pageNumbers: number[] = [];
  pageSizeOptions: number[] = [10, 20, 50];
  currentPageIndex = 0;
  totalItemsCount: number;
  selection = new SelectionModel<CandidateModel>(true, []);
  searchCandidate: any;
  selectedCollege: any;
  selectedGroup: any;
  selectedStatus: any;
  statusValue: boolean;
  private ngUnsubscribe$: Subject<void> = new Subject();

  constructor(public dialog: MatDialog,
    private router: Router,
    private candidateService: CandidateService,
    private snackbarService: SnackbarService) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<CandidateModel>([]);
    this.fetchCandidate();

    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges = colleges;
    });

    this.candidateService.getGroupsForDropDown().subscribe((colleges) => {
      this.groups = colleges;
    });
  }

  fetchCandidate() {
    const searchQuery = this.searchCandidate;
    const collegeId = this.selectedCollege;
    const groupId = this.selectedGroup;
    const status = this.selectedStatus;

    this.candidateService
      .getCandidate(this.currentPageIndex, this.pageSize, searchQuery, collegeId, groupId, status)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<CandidateModel>(data);
        if (data && data.length > 0) {
          this.totalItemsCount = data[0].totalRecords;
        }
        this.updatePageNumbers();
      });
  }

  onFilterChange() {
    if (this.selectedStatus === 'Active') {
      this.selectedStatus = true;
    } else {
      this.selectedStatus = false;
    }
    this.fetchCandidate();
  }

  clearFilters() {
    this.searchCandidate = '';
    this.selectedGroup = '';
    this.selectedCollege = '';
    this.selectedStatus = '';

    this.fetchCandidate();
  }

  handleAddCandidateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    dialogConfig.width = "800px";
    const dialogRef = this.dialog.open(AddCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.refreshTable === true) {
        this.fetchCandidate();
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: CandidateModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.firstName + 1}`;
  }

  getSelectedRowIds(): { userId: number, status: boolean }[] {
    return this.selection.selected.map(row => ({ userId: row.userId, status: row.status }));
  }

  handleDeleteSelected() {
    const selectedRows = this.getSelectedRowIds();
    if (selectedRows.length === 0) {
      return;
    }
    this.handleDeleteCandidateDialog(selectedRows.map(row => row.userId));
  }

  handleActiveInactiveSelected(status: boolean) {
    const selectedRows = this.getSelectedRowIds();
    if (selectedRows.length === 0) {
      return;
    }
    const userIds = selectedRows.map(row => row.userId);
    this.updateStatus(userIds, status);
  }

  handleAddCollegeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["primary-dialog"];
    dialogConfig.autoFocus = false;
    this.dialog.open(AddCollegeComponent, dialogConfig);
  }

  handleDeleteCandidateDialog(id: number[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ["confirmation-dialog"];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
    dialogRef?.afterClosed().subscribe((result: any) => {
      if (result) {
        this.candidateService.deleteCandidate(id)
          .pipe(
            takeUntil(this.ngUnsubscribe$),
            catchError((error: any) => {
              this.snackbarService.error(error);
              return throwError(error);
            })
          )
          .subscribe(() => {
            this.fetchCandidate();
          });
      }
    });
  }

  importCandidates() {
    this.router.navigate(['admin/candidate/import-candidate']);
  }

  handleEditCandidate(candidate: CandidateModel) {
    this.router.navigate(['admin/candidate/edit']);
  }

  updateStatus(id: number[], newStatus: boolean): void {
    this.candidateService.updateStatus(id, newStatus).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.fetchCandidate();
        }
      },
    })
  }

  onPageSizeChange() {
    this.currentPageIndex = 0;
    this.fetchCandidate();
  }

  onPageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.fetchCandidate();
  }

  updatePageNumbers() {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChangeToPage(page: number) {
    this.currentPageIndex = page - 1;
    this.fetchCandidate();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === 0;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - 1;
  }

  getFirstEntryIndex(): number {
    return this.currentPageIndex * this.pageSize + 1;
  }

  getLastEntryIndex(): number {
    const lastEntry = (this.currentPageIndex + 1) * this.pageSize;
    return lastEntry <= this.totalItemsCount ? lastEntry : this.totalItemsCount;
  }

  getDisplayedRange(): string {
    const firstEntry = this.getFirstEntryIndex();
    const lastEntry = this.getLastEntryIndex();
    return `Showing ${firstEntry} - ${lastEntry} of ${this.totalItemsCount} entries`;
  }
}