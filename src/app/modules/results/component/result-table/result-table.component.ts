import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ResultModel } from '../../interfaces/result.interface';
import { DisplayedColumns } from '../../static/results.static';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.scss'],
})
export class ResultTableComponent {
  displayedColumns = DisplayedColumns;
  selectedOption = '10';
  pageNumbers: number[] = [];
  currentPageIndex: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  @Input() totalItemsCount: number = 0;
  @Input() pageSize: number = 10;
  @Input() dataSource: MatTableDataSource<ResultModel>;
  @Output() detailsClicked = new EventEmitter<{ id: number; testId: number }>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() pageChanged = new EventEmitter<'prev' | 'next'>();
  @Output() pageToPage = new EventEmitter<number>();
  @Output() sortingChanged = new EventEmitter<Sort>();
  @ViewChild(MatSort) sort = new MatSort();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalItemsCount'] || changes['pageSize']) {
      this.updatePageNumbers();
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
