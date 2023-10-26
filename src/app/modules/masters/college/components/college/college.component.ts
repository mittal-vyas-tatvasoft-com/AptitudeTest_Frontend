  import { Component } from '@angular/core';
  import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
  import { MatTableDataSource } from '@angular/material/table';
  import { AddCollegeComponent } from '../add-college/add-college.component';
  import { CollegeService } from '../../services/college.service';
  import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
  import { CollegeModel } from '../../interfaces/college.interface';
import { takeUntil, catchError, throwError, Subject } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';


  @Component({
    selector: 'app-college',
    templateUrl: './college.component.html',
    styleUrls: ['./college.component.scss']
  })
  export class CollegeComponent {
    pageSizeOptions: number[] = [10, 25, 50];
    pageSize = 10;
    currentPageIndex = 0;
    displayedColumns: string[] = ['name', 'abbreviation', 'status', 'action'];
    dataSource: MatTableDataSource<CollegeModel>;
    totalItemsCount!: number;
    pageNumbers: number[] = [];
    private ngUnsubscribe$: Subject<void> = new Subject(); 

    constructor(public dialog: MatDialog, private collegeService: CollegeService,private snackbarService: SnackbarService) {}

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
          this.updatePageNumbers();
        });
    }

    updateStatus(college: CollegeModel, newStatus: boolean): void {
      college.status = newStatus
      this.collegeService.updateCollege(college).subscribe(
        (response: any) => {
          college.status = newStatus;
          console.log('Status updated:', response);
        },
        (error) => {
          console.error('Error updating status:', error);
        }
      );
    }

    handleAddCollegeDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog'];
      dialogConfig.autoFocus = false;
      const dialogRef = this.dialog.open(AddCollegeComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.refreshTable === true) {
          this.fetchColleges();
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
        if (result && result.refreshTable === true) {
          this.fetchColleges();
        }
      });
    }

    handleDeleteProfileDialog(id: any) {
      console.log("id", id)
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ["primary-dialog"];
      dialogConfig.panelClass = ["confirmation-dialog"];
      dialogConfig.autoFocus = false;
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);
      dialogRef?.afterClosed().subscribe((result: any) => {
        if (result) {
          this.collegeService.deleteCollege(id)
            .pipe(
              takeUntil(this.ngUnsubscribe$),
              catchError((error: any) => {
                this.snackbarService.error(error);
                return throwError(error);
              })
            )
            .subscribe(() => {
              this.fetchColleges();
            });
        }
      });
    }

    onPageSizeChange() {
      this.currentPageIndex = 0; // Reset to the first page
      this.fetchColleges();
    }

    onPageChange(direction: 'prev' | 'next') {
      if (direction === 'prev' && !this.isFirstPage()) {
        this.currentPageIndex--;
      } else if (direction === 'next' && !this.isLastPage()) {
        this.currentPageIndex++;
      }
      this.fetchColleges();
    }

    updatePageNumbers() {
      const totalPages = Math.ceil(this.totalItemsCount / this.pageSize);
      this.pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    onPageChangeToPage(page: number) {
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


