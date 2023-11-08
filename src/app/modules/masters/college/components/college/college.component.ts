import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from '../add-college/add-college.component';
import { CollegeService } from '../../services/college.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CollegeModel } from '../../interfaces/college.interface';
import { takeUntil, catchError, throwError, Subject } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { EventEmitter } from '@angular/core';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { Numbers, StatusCode } from 'src/app/shared/common/enums';

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss'],
})
export class CollegeComponent {
  pageSize = Numbers.Ten;
  currentPageIndex = Numbers.Zero;
  totalItemsCount: number;
  pageNumbers: number[] = [];
  dataSource: MatTableDataSource<CollegeModel>;
  columns: TableColumn<CollegeModel>[] = [
    { columnDef: 'name', header: 'Name of College' },
    { columnDef: 'abbreviation', header: 'Abbreviation' },
    { columnDef: 'status', header: 'Status' },
    { columnDef: 'action', header: 'Action', isAction: true },
  ];
  private ngUnsubscribe$: Subject<void> = new Subject();

  constructor(
    public dialog: MatDialog,
    private collegeService: CollegeService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<CollegeModel>([]);
    this.fetchColleges();
  }

  fetchColleges() {
    this.collegeService
      .getColleges(this.currentPageIndex, this.pageSize)
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<CollegeModel>(data.entityList);
        this.totalItemsCount = data.totalItemsCount;
      });
  }

  updateStatus(id: number, newStatus: boolean): void {
    this.collegeService.updateStatus(id, newStatus).subscribe({
      next: (res: any) => {
        if (res.statusCode == StatusCode.Success) {
          this.snackbarService.success(res.message);
          this.fetchColleges();
        } else {
          this.snackbarService.error(res.message);
        }
      },
    });
  }

  handleAddCollegeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(AddCollegeComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.refreshTable === true && result.status === StatusCode.Success) {
        this.snackbarService.success(result.message);
        this.fetchColleges();
      } else {
        this.snackbarService.error(result.message);
      }
    });
  }

  handleEditCollegeDialog(college: CollegeModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = { college, refreshTable: () => this.fetchColleges() };
    const dialogRef = this.dialog.open(AddCollegeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.refreshTable === true && result.status === StatusCode.Success) {
        this.snackbarService.success(result.message);
        this.fetchColleges();
      } else {
        this.snackbarService.error(result.message);
      }
    });
  }

  handleDeleteProfileDialog(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.panelClass = ['confirmation-dialog'];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef?.afterClosed().subscribe((result: any) => {
      if (result) {
        this.collegeService.deleteCollege(id).subscribe({
          next: (res: any) => {
            if (res.statusCode == StatusCode.Success) {
              this.fetchColleges();
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
    this.fetchColleges();
  }

  handlePageChange(direction: 'prev' | 'next') {
    if (direction === 'prev' && !this.isFirstPage()) {
      this.currentPageIndex--;
    } else if (direction === 'next' && !this.isLastPage()) {
      this.currentPageIndex++;
    }
    this.fetchColleges();
  }

  handlePageToPage(page: number) {
    this.currentPageIndex = page - Numbers.One;
    this.fetchColleges();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === Numbers.Zero;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - Numbers.One;
  }
}
