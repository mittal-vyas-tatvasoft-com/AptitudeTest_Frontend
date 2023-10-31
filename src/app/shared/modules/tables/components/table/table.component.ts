import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../../interfaces/table-data.interface';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> {
  pageNumbers: number[] = [];
  currentPageIndex: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() columns: TableColumn<T>[] = [];
  @Input() pagination: boolean = true;
  @Input() totalItemsCount: number = 0;
  @Input() pageSize: number = 10;
  @Output() editClicked = new EventEmitter<T>();
  @Output() deleteClicked = new EventEmitter<number>();
  @Output() actionClicked = new EventEmitter<{ row: number, action: boolean }>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<'prev' | 'next'>();
  @Output() pageToPage = new EventEmitter<number>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItemsCount'] || changes['pageSize']) {
      this.updatePageNumbers();
    }
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
    this.currentPageIndex = 0;
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
    this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
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
    const firstEntry = this.getFirstEntryIndex();
    const lastEntry = this.getLastEntryIndex();
    return `Showing ${firstEntry} - ${lastEntry} of ${this.totalItemsCount} entries`;
  }

}