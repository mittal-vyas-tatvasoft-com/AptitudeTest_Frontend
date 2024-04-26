import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ResultModel } from '../../interfaces/result.interface';
import { DisplayedColumns, ResultStatus } from '../../static/results.static';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdminApprovalComponent } from '../admin-approval/admin-approval.component';
import { SelectionModel } from '@angular/cdk/collections';
import { last } from 'rxjs';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss'],
})
export class ResultTableComponent {
  resultStatus = ResultStatus;
  displayedColumns = DisplayedColumns;
  selectedOption = '10';
  pageNumbers: number[] = [];
  currentPageIndex: number = 0;
  pageSizeOptions: any[] = [
    { display: '10', value: 10 },
    { display: '20', value: 20 },
    { display: '50', value: 50 },
    { display: '100', value: 100 },
  ];
  pageLengthForNormalPages = 8;
  pagesToDisplay = 3;
  @Input() totalItemsCount: number = 0;
  @Input() pageSize: number = 10;
  @Input() dataSource: MatTableDataSource<ResultModel>;
  @Output() detailsClicked = new EventEmitter<{ id: number; testId: number }>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<'prev' | 'next'>();
  @Output() pageToPage = new EventEmitter<number>();
  @Output() sortingChanged = new EventEmitter<Sort>();
  @ViewChild(MatSort) sort = new MatSort();
  @Output() checkboxClicked = new EventEmitter<{
    userId: number;
    testId: number;
  }>();
  @Output() testUnlockClicked = new EventEmitter<{
    userId: number;
    testId: number;
  }>();
  @Output() allCheckboxesSelected = new EventEmitter<boolean>();
  selection = new SelectionModel<any>(true, []); // This selection model is used for item selection, and the type is not specific.

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItemsCount'] || changes['pageSize']) {
      this.updatePageNumbers();
    }

    if (this.totalItemsCount > 0) {
      const item = this.pageSizeOptions.find((x) => x.display === 'All');
      if (item == undefined) {
        this.pageSizeOptions.push({
          display: 'All',
          value: this.totalItemsCount,
        });
      } else {
        item.value = this.totalItemsCount;
      }
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((event) => {
      this.sortingChanged.emit(event);
    });
  }

  handleDetails(id: number, testId: number) {
    this.detailsClicked.emit({ id, testId });
  }

  handleCheckBox(userId: number, testId: number) {
    this.checkboxClicked.emit({ userId, testId });
  }

  handleTestUnlock(userId: number, testId: number) {
    this.testUnlockClicked.emit({ userId, testId });
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.firstName + 1
    }`;
  }

  allRowsSelected() {
    const areAllRowsSelected = this.isAllSelected();
    if (areAllRowsSelected) {
      this.allCheckboxesSelected.emit(true);
    } else {
      this.allCheckboxesSelected.emit(false);
    }
  }

  onPageSizeChange() {
    this.currentPageIndex = 0;
    if (this.pageSize.toString() === 'All') {
      this.pageSizeChanged.emit(this.totalItemsCount);
    } else {
      this.pageSizeChanged.emit(this.pageSize);
    }
    //this.pageSizeChanged.emit(this.pageSize);
  }

  onPageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.pageChanged.emit(direction);
  }

  updatePageNumbers() {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getTotalPages() {
    return Math.ceil(this.totalItemsCount / this.pageSize);
  }

  onPageChangeToPage(page: number) {
    this.currentPageIndex = page - 1;
    this.pageToPage.emit(page);
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
    var firstEntry = this.getFirstEntryIndex();
    var lastEntry = this.getLastEntryIndex();

    // if (isNaN(Number(firstEntry)) && lastEntry == this.totalItemsCount) {
    //   return 'Showing All Entries';
    // }
    if (lastEntry == this.totalItemsCount) {
      return 'Showing All Entries';
    }
    return `Showing ${firstEntry} - ${lastEntry} of ${this.totalItemsCount} entries`;
  }

  handleAdminApproveDialog(userId: number, testId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = { userId: userId, testId: testId };
    this.dialog
      .open(AdminApprovalComponent, dialogConfig)
      .afterClosed()
      .subscribe();
  }
}
