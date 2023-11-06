import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../../interfaces/table-data.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Numbers } from 'src/app/shared/common/enums';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> {
  pageNumbers: number[] = [];
  currentPageIndex: number = Numbers.Zero;
  pageSizeOptions: number[] = [10, 20, 50];
  selection = new SelectionModel<any>(true, []); // This selection model is used for item selection, and the type is not specific.
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() columns: TableColumn<T>[] = [];
  @Input() pagination: boolean = true;
  @Input() totalItemsCount: number = Numbers.Zero;
  @Input() pageSize: number = Numbers.Ten;
  @Output() editClicked = new EventEmitter<T>();
  @Output() deleteClicked = new EventEmitter<number>();
  @Output() actionClicked = new EventEmitter<{
    row: number;
    action: boolean;
  }>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<'prev' | 'next'>();
  @Output() pageToPage = new EventEmitter<number>();
  @ViewChild(MatSort) sort = new MatSort();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItemsCount'] || changes['pageSize']) {
      this.updatePageNumbers();
    }
    this.dataSource.sort = this.sort
  }

  handleEdit(row: T) {
    this.editClicked.emit(row);
  }

  handleDelete(id: number) {
    this.deleteClicked.emit(id);
  }

  handleAction(row: number, action: boolean) {
    this.actionClicked.emit({ row, action });
  }

  getDisplayedColumns() {
    return this.columns.map((column) => column.columnDef);
  }

  onPageSizeChange() {
    this.currentPageIndex = Numbers.Zero;
    this.pageSizeChanged.emit(this.pageSize);
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
    this.pageNumbers = Array.from(
      { length: totalPages },
      (_, i) => i + Numbers.One
    );
  }

  onPageChangeToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.pageToPage.emit(page);
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }

  getFirstEntryIndex(): number {
    return this.currentPageIndex * this.pageSize + Numbers.One;
  }

  getLastEntryIndex(): number {
    const lastEntry = (this.currentPageIndex + Numbers.One) * this.pageSize;
    return lastEntry <= this.totalItemsCount ? lastEntry : this.totalItemsCount;
  }

  getDisplayedRange(): string {
    const firstEntry = this.getFirstEntryIndex();
    const lastEntry = this.getLastEntryIndex();
    return `Showing ${firstEntry} - ${lastEntry} of ${this.totalItemsCount} entries`;
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

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.firstName + 1}`;
  }

  getSelectedRowIds(): { userId: number, status: boolean }[] {
    return this.selection.selected.map(row => ({ userId: row.id, status: row.status }));
  }
}
