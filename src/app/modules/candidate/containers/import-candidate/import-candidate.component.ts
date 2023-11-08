import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CandidateModel,
  DropdownItem,
} from '../../interfaces/candidate.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddGroupComponent } from 'src/app/modules/groups/containers/add-group/add-group.component';
import { DragDropInput, dropzoneConfig } from '../../static/candidate.static';
import { CandidateService } from '../../services/candidate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import {
  Numbers,
  StaticMessages,
  StatusCode,
} from 'src/app/shared/common/enums';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import {
  DropzoneComponent,
  DropzoneDirective,
  DropzoneMethodFunction,
  DropzoneModule,
} from 'ngx-dropzone-wrapper';
import {
  DropzoneEvent,
  DropzoneFallbackFunction,
} from 'ngx-dropzone-wrapper/lib/dropzone.interfaces';

@Component({
  selector: 'app-import-candidate',
  templateUrl: './import-candidate.component.html',
  styleUrls: ['./import-candidate.component.scss'],
})
export class ImportCandidateComponent implements OnInit {
  colleges: DropdownItem[] = [];
  collegesForFilter: DropdownItem[] = [{ id: 0, name: 'All' }];
  groups: DropdownItem[];
  dropzoneConfig = dropzoneConfig;

  status = [
    { key: 'Select', value: null },
    { key: 'Active', value: true },
    { key: 'InActive', value: false },
  ];
  optionsList: number[] = [];
  form: FormGroup;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<CandidateModel>;
  selection = new SelectionModel<CandidateModel>(true, []);
  public message: string = DragDropInput;
  statusValue: boolean | null;
  currentPageIndex = Numbers.Zero;
  totalItemsCount: number;
  pageSize = Numbers.Ten;
  fileName: string = '';
  noFileSet: boolean = true;
  importSuccessFully: boolean = false;
  importCount: number;
  private searchInputValue = new Subject<string>();

  columns: TableColumn<CandidateModel>[] = [
    { columnDef: 'select', header: '' },
    { columnDef: 'name', header: 'Name' },
    { columnDef: 'collegeName', header: 'College' },
    { columnDef: 'groupName', header: 'Group' },
    { columnDef: 'email', header: 'Email ID' },
    { columnDef: 'phoneNumber', header: 'Contact No.' },
    { columnDef: 'createdYear', header: 'Year Added' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action', isAction: true },
  ];
  @ViewChild('myTable') myTable: TableComponent<any>;
  @ViewChild('dropzone') dropzone: DropzoneDirective;
  // @ViewChild('myDropzone', { static: false }) dropzone: NgxDropzoneComponent;
  @ViewChild(DropzoneComponent, { static: false })
  componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective)
  directive?: DropzoneDirective;
  formData = new FormData();

  constructor(
    public dialog: MatDialog,
    private candidateService: CandidateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.dataSource = new MatTableDataSource<CandidateModel>([]);
    this.fetchCandidate();
    this.getDropdowns();
    this.searchInputValue
      .pipe(
        debounceTime(1000) // Adjust the debounce time as needed
      )
      .subscribe((value) => {
        this.fetchCandidate();
      });
  }

  createForm() {
    this.form = this.formBuilder.group({
      file: ['', Validators.required],
      groupId: [0],
      collegeId: [0],
    });
    this.filterForm = this.formBuilder.group({
      collegeId: [0],
      status: [''],
      searchQuery: [''],
    });
  }

  search(value: string) {
    this.searchInputValue.next(value);
  }

  fetchCandidate() {
    const searchQuery = this.filterForm.get('searchQuery')?.value;
    const collegeId = this.filterForm.get('collegeId')?.value;
    const status = this.filterForm.get('status')?.value;

    this.candidateService
      .getCandidate(
        this.currentPageIndex,
        this.pageSize,
        searchQuery,
        collegeId,
        0,
        0,
        status
      )
      .subscribe((data: any) => {
        data.forEach(
          (candidate: {
            name: string;
            firstName: string;
            lastName: string;
          }) => {
            candidate.name = `${candidate.firstName} ${
              candidate.lastName || ''
            }`;
          }
        );
        this.dataSource = new MatTableDataSource<CandidateModel>(data);
        if (data && data.length > 0) {
          this.totalItemsCount = data[0].totalRecords;
        }
      });
  }

  getDropdowns() {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.optionsList.push(year);
    }

    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges = colleges;
      this.collegesForFilter = [...this.colleges, ...colleges];
    });

    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      this.groups = groups;
    });
  }

  onFilterChange() {
    this.fetchCandidate();
  }

  clearFilters() {
    this.filterForm.reset();
    this.fetchCandidate();
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

  handleAddGroupDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.width = '550px';
    this.dialog.open(AddGroupComponent, dialogConfig);
  }

  getDeleteCandidateDialog(id: number) {
    const idArray: number[] = [id];
    this.handleDeleteCandidateDialog(idArray);
  }

  setPayloadForImportCandidate(event: any) {
    this.formData.append('file', event);

    this.formData.append('groupId', this.form.get('groupId')?.value ?? null);
    this.formData.append(
      'collegeId',
      this.form.get('collegeId')?.value ?? null
    );
    if (event != null) {
      this.fileName = event.name;
      this.noFileSet = false;
    }
  }

  handleImportCandidate() {
    this.candidateService.importCandidate(this.formData).subscribe({
      next: (res: any) => {
        this.componentRef?.directiveRef?.reset();
        if (res.statusCode == StatusCode.Success) {
          this.fetchCandidate();
          this.importCount = res.data;
          this.importSuccessFully = true;
          setTimeout(() => {
            this.importSuccessFully = false;
          }, 3000);
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  handleImportFileError(event: any) {
    this.noFileSet = true;
    this.snackbarService.error(event[1]);
  }

  onDropzoneQueueComplete() {
    // alert('hello');
    this.fileName = '';
    this.noFileSet = true;
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

  handleEditCandidate(candidate: CandidateModel) {
    this.router.navigate(['admin/candidate/edit', candidate.id]);
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

  getupdateStatus(id: number, newStatus: boolean) {
    const idArray: number[] = [id];
    this.updateStatus(idArray, newStatus);
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
}
