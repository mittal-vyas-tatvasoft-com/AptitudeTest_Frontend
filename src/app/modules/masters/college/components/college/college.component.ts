import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddCollegeComponent } from '../add-college/add-college.component';
import { CollegeService } from '../../services/college.service';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CollegeModel } from '../../interfaces/college.interface';
import { Subject } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { TableColumn } from 'src/app/shared/modules/tables/interfaces/table-data.interface';
import { StatusCode } from 'src/app/shared/common/enums';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss'],
})
export class CollegeComponent implements OnInit {
  pageSize = 10;
  currentPageIndex = 0;
  totalItemsCount: number;
  sortKey = '';
  sortDirection = '';
  addCollege: CollegeModel = {
    id: 0,
    name: '',
    abbreviation: '',
    status: true,
  };
  pageNumbers: number[] = [];
  dataSource: MatTableDataSource<CollegeModel>;
  columns: TableColumn<CollegeModel>[] = [
    { columnDef: 'name', header: 'Name of College', width: '40%' },
    { columnDef: 'abbreviation', header: 'Abbreviation', width: '30%' },
    { columnDef: 'status', header: 'Status', width: '15%' },
    { columnDef: 'action', header: 'Action', isAction: true, width: '15%' },
  ];
  private ngUnsubscribe$: Subject<void> = new Subject();

  constructor(
    public dialog: MatDialog,
    private collegeService: CollegeService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<CollegeModel>([]);
    this.fetchColleges();
  }

  fetchColleges() {
    this.collegeService
      .getColleges(
        this.currentPageIndex,
        this.pageSize,
        this.sortKey,
        this.sortDirection
      )
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

  handleAddEditCollegeDialog(data: CollegeModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    dialogConfig.data = data.id;

    this.dialog
      .open(AddCollegeComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        const payload: CollegeModel = {
          id: res.id,
          name: res.name,
          abbreviation: res.abbreviation,
          status: res.status === 1,
        };
        if (res) {
          if (res.id == 0) {
            this.collegeService.addCollege(payload).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.fetchColleges();
                  this.snackbarService.success(res.message);
                } else {
                  this.snackbarService.error(res.message);
                }
              },
            });
          } else {
            this.collegeService.updateCollege(payload).subscribe({
              next: (res) => {
                if (res.statusCode == StatusCode.Success) {
                  this.fetchColleges();
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
    this.currentPageIndex = 0;
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
    this.currentPageIndex = page - 1;
    this.fetchColleges();
  }

  isFirstPage(): boolean {
    return this.currentPageIndex === 0;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
    return this.currentPageIndex === totalPages - 1;
  }

  handleDataSorting(event: Sort) {
    switch (event.active) {
      case 'name':
        this.sortKey = 'Name';
        this.sortDirection = event.direction;
        break;
      case 'abbreviation':
        this.sortKey = 'Abbreviation';
        this.sortDirection = event.direction;
        break;
      default:
        this.sortKey = '';
        this.sortDirection = '';
        break;
    }
    this.fetchColleges();
  }
}
