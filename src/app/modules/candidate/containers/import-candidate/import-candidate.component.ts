import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DropzoneComponent, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { Subject, debounceTime } from 'rxjs';
import { AddGroupComponent } from 'src/app/modules/groups/containers/add-group/add-group.component';
import { GroupsService } from 'src/app/modules/groups/services/groups.service';
import {
  Numbers,
  StaticMessages,
  StatusCode,
} from 'src/app/shared/common/enums';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SelectOption } from 'src/app/shared/modules/form-control/interfaces/select-option.interface';
import { TableComponent } from 'src/app/shared/modules/tables/components/table/table.component';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import {
  candidateFilterFormConfig,
  importCandidateFormConfig,
} from '../../configs/candidate.configs';
import {
  CandidateModel,
  DropdownItem,
  GetAllCandidateParams,
} from '../../interfaces/candidate.interface';
import { CandidateService } from '../../services/candidate.service';
import {
  DragDropInput,
  dropzoneConfig,
  importCandidateSampleFileName,
  importCandidateSampleFilePath,
} from '../../static/candidate.static';

@Component({
  selector: 'app-import-candidate',
  templateUrl: './import-candidate.component.html',
  styleUrls: ['./import-candidate.component.scss'],
})
export class ImportCandidateComponent implements OnInit, AfterViewInit {
  colleges: SelectOption[] = [];
  groups: SelectOption[] = [];
  collegesForFilter: DropdownItem[] = [{ id: 0, name: 'All' }];
  dropzoneConfig = dropzoneConfig;
  optionsList: SelectOption[] = [];
  form: FormGroup;
  filterForm: FormGroup;
  dataSource: MatTableDataSource<CandidateModel>;
  selection = new SelectionModel<CandidateModel>(true, []);
  statusValue: boolean | null;
  currentPageIndex = Numbers.Zero;
  totalItemsCount: number;
  pageSize = Numbers.Ten;
  sortKey: string;
  sortDirection: string;
  fileName = '';
  formData = new FormData();
  defaultGroupId: number;
  noFileSet = true;
  groupAndCollegeSelected = false;
  importSuccessFully = false;
  importCount: number;
  private searchInputValue = new Subject<string>();
  public message: string = DragDropInput;
  importCandidateFormConfig = importCandidateFormConfig;
  candidateFilterForm = candidateFilterFormConfig;
  status: SelectOption[] = [
    { value: 'Select', id: '' },
    { value: 'Active', id: true },
    { value: 'Inactive', id: false },
  ];
  columns: TableColumn<CandidateModel>[] = [
    { columnDef: 'select', header: '', width: '5%' },
    { columnDef: 'name', header: 'Name', width: '15%' },
    { columnDef: 'collegeName', header: 'College', width: '15%' },
    { columnDef: 'groupName', header: 'Group', width: '15%' },
    { columnDef: 'email', header: 'Email ID', width: '20%' },
    { columnDef: 'phoneNumber', header: 'Contact No.', width: '10%' },
    { columnDef: 'createdYear', header: 'Year Added', width: '5%' },
    { columnDef: 'status', header: 'Status', width: '10%' },
    { columnDef: 'action', header: 'Action', isAction: true, width: '5%' },
  ];
  @ViewChild('myTable') myTable: TableComponent<any>;
  @ViewChild('dropzone', { static: false }) dropzone: DropzoneComponent;
  @ViewChild(DropzoneComponent, { static: false })
  componentRef?: DropzoneComponent;
  @ViewChild(DropzoneDirective)
  directive?: DropzoneDirective;
  constructor(
    public dialog: MatDialog,
    private candidateService: CandidateService,
    private groupsService: GroupsService,
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
        debounceTime(Numbers.Debounce) // Adjust the debounce time as needed
      )
      .subscribe(() => {
        this.fetchCandidate();
      });

    this.form.get('groupId')?.valueChanges.subscribe((res) => {
      if (res != null && this.form.get('collegeId')?.value != '') {
        this.groupAndCollegeSelected = true;
      } else {
        this.groupAndCollegeSelected = false;
      }
    });
    this.form.get('collegeId')?.valueChanges.subscribe((res) => {
      if (res != null && this.form.get('groupId')?.value != '') {
        this.groupAndCollegeSelected = true;
      } else {
        this.groupAndCollegeSelected = false;
      }
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      file: ['', Validators.required],
      groupId: ['', Validators.required],
      collegeId: ['', Validators.required],
    });
    this.filterForm = this.formBuilder.group({
      groupId: [''],
      collegeId: [''],
      status: [''],
      searchQuery: [''],
    });
  }

  ngAfterViewInit(): void {
    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      groups.forEach((group) => {
        if (group.isDefault) {
          this.defaultGroupId = group.id;
          this.form.get('groupId')?.setValue(group.id);
        }
      });
    });
  }

  search() {
    this.searchInputValue.next('');
  }

  fetchCandidate() {
    const searchQuery = this.filterForm.get('searchQuery')?.value;
    const collegeId = this.filterForm.get('collegeId')?.value;
    const groupId = this.filterForm.get('groupId')?.value;
    const status = this.filterForm.get('status')?.value;

    const params: GetAllCandidateParams = {
      currentPageIndex: this.currentPageIndex,
      pageSize: this.pageSize,
      searchQuery: searchQuery,
      collegeId: collegeId,
      groupId: groupId,
      status: status,
      year: null,
      sortField: this.sortKey,
      sortOrder: this.sortDirection,
    };

    this.candidateService.getCandidate(params).subscribe((data: any) => {
      data.forEach(
        (candidate: { name: string; firstName: string; lastName: string }) => {
          candidate.name = `${candidate.firstName ? candidate.firstName : ''} ${
            candidate.lastName ? candidate.lastName : ''
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
      this.optionsList.push({ value: year.toString(), id: year });
    }

    this.candidateService.getCollegesForDropDown().subscribe((colleges) => {
      this.colleges.push({ value: 'All', id: '' });
      colleges.forEach((element) => {
        this.colleges.push({ value: element.name.toString(), id: element.id });
      });
    });

    this.candidateService.getGroupsForDropDown().subscribe((groups) => {
      this.groups.push({ value: 'All', id: '' });
      groups.forEach((group) => {
        if (group.isDefault) {
          const defaultGroupName = group.name + ' (Default Group) ';
          this.groups.push({ value: defaultGroupName, id: group.id });
        }
      });
      groups.forEach((group) => {
        if (!group.isDefault) {
          this.groups.push({ value: group.name, id: group.id });
        }
      });
    });
  }

  onFilterChange() {
    this.fetchCandidate();
  }

  clearFilters() {
    this.filterForm.get('searchQuery')?.setValue('');
    this.filterForm.get('collegeId')?.setValue('');
    this.filterForm.get('groupId')?.setValue('');
    this.filterForm.get('status')?.setValue('');
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
    dialogConfig.width = '556px';
    dialogConfig.data = 0;
    this.dialog
      .open(AddGroupComponent, dialogConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data != null) {
          if (data.id == 0) {
            this.groupsService.create(data).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.groups = [];
                  this.getDropdowns();
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

  getDeleteCandidateDialog(id: number) {
    const idArray: number[] = [id];
    this.handleDeleteCandidateDialog(idArray);
  }

  setPayloadForImportCandidate(event: File) {
    this.formData.append('file', event);
    if (event != null) {
      this.fileName = event.name;
      this.noFileSet = false;
    }
  }

  handleImportCandidate() {
    this.formData.append('groupId', this.form.get('groupId')?.value ?? null);
    this.formData.append(
      'collegeId',
      this.form.get('collegeId')?.value ?? null
    );
    this.candidateService.importCandidate(this.formData).subscribe({
      next: (res) => {
        this.dropzone?.directiveRef?.reset();
        this.formData = new FormData();
        this.formData.append('groupId', '');
        this.formData.append('collegeId', '');
        this.fileName = '';
        this.noFileSet = true;
        if (res.statusCode == StatusCode.Success) {
          this.fetchCandidate();
          this.importCount = +res.data;
          this.importSuccessFully = true;
          setTimeout(() => {
            this.importSuccessFully = false;
          }, 3000);
          this.fileName = '';
          this.noFileSet = true;
          this.snackbarService.success(res.message);
        } else {
          this.snackbarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackbarService.error(err.statusText);
        this.formData = new FormData();
      },
    });
    this.form.reset();
  }

  handleImportFileError(event: any) {
    this.noFileSet = true;
    this.snackbarService.error(event[1]);
    this.componentRef?.directiveRef?.reset();
  }

  onDropzoneQueueComplete() {
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

      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }
    this.fetchCandidate();
  }

  downloadSampleFile() {
    const filePath = importCandidateSampleFilePath;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = importCandidateSampleFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
