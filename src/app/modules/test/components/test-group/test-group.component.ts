import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { TestCandidatesModel } from '../../interfaces/test.interface';

@Component({
  selector: 'app-test-group',
  templateUrl: './test-group.component.html',
  styleUrls: ['./test-group.component.scss'],
})
export class TestGroupComponent {
  @Input() testGroupForm: FormGroup;
  @Input() testGroupFilterForm: FormGroup;
  @Input() colleges: SelectOption[];
  @Input() testGroupFormModel: any;
  @Input() testGroupFilterModel: any;
  @Input() groups: SelectOption[];
  @Input() columns: TableColumn<TestCandidatesModel>[];
  @Input() dataSource: MatTableDataSource<TestCandidatesModel>;
  @Input() totalItemsCount: number;
  @Input() pageSize: number;
  @Input() pagination: boolean;
  @Output() updateGroup = new EventEmitter();
  @Output() handlePageSizeChangeEvent = new EventEmitter();
  @Output() handlePageToPageEvent = new EventEmitter();
  @Output() handlePageChangeEvent = new EventEmitter();
  @Output() handleDataSortingEvent = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() changeSelection = new EventEmitter();
  @Output() clearSearchFilter = new EventEmitter();

  searchTestCandidates() {
    this.search.emit();
  }

  updateTestGroup() {
    this.updateGroup.emit();
  }

  handlePageSizeChange(event: any) {
    this.handlePageSizeChangeEvent.emit(event);
  }

  handlePageToPage(event: any) {
    this.handlePageToPageEvent.emit(event);
  }

  handleDataSorting(event: any) {
    this.handleDataSortingEvent.emit(event);
  }

  handlePageChange(event: any) {
    this.handlePageChangeEvent.emit(event);
  }

  changeFilterSelection() {
    this.changeSelection.emit();
  }

  clearFilter() {
    this.clearSearchFilter.emit();
  }
}
