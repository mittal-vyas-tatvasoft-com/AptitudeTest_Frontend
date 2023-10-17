import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TechnologyService } from '../../services/technology.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTechnologyComponent } from '../add-technology/add-technology.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogService } from 'src/app/shared/services/dialog/dialog.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['srNo', 'technologyName', 'status', 'action'];
  searchValue: string = '';
  filterValue: string = 'all';
  showFilters: boolean = true;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private technologyService: TechnologyService,
    private dialog: MatDialog,
    private dialogService: DialogService
    ) { }

  ngOnInit(): void {
    //this.fetchTechnologies();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fetchTechnologies();
    }, 0);
  }


  fetchTechnologies(): void {
    console.log("this.paginator", this.paginator.pageSize);
    if (this.paginator) {
      let filterParam = '';
      if (this.filterValue === 'active') {
        filterParam = '1';
      } else if (this.filterValue === 'inactive') {
        filterParam = '2';
      }
      this.technologyService.getFilteredTechnologies(filterParam, this.searchValue, 0,0)
      .subscribe((data: any) => {
        console.log("filterParam",filterParam);
        console.log("this.searchValue",this.searchValue);
        console.log("this.paginator.pageIndex + 1",this.paginator.pageIndex + 1);
        console.log("this.paginator.pageSize",this.paginator.pageSize);
        console.log("Data log", data.data.entityList);
        this.dataSource.data = data.data.entityList;
        this.dataSource.paginator = this.paginator;
        console.log('Fetched Data: ', this.dataSource.data);
      });
    }
  }

  applyFilter(): void {
    this.fetchTechnologies();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.filterValue = 'all'; 
    this.applyFilter();
  }
  
  save(element: any) {
    console.log("element", element)
    this.technologyService.updateTechnology(element).subscribe();
    element.isEditMode = false;
  }

  delete(id: any) {
    const dialogRef = this.dialogService.openModel(
      DeleteConfirmationDialogComponent,
      {
        data: {
          data: id,
          title: 'Delete Technology',
          message: 'Are you sure want to delete this weekend?',
          buttonText: { ok: 'Yes', cancel: 'No' },
          showConfirmButton: true,
          customConfirmButtonStyle: true,
          hasBackdrop: true,
          maxWidth: '400px',
          width: '400px',
          showDialogIcon: true,
        },
        message: 'Delete Technology',
      },
    );
    dialogRef?.afterClosed().subscribe((result: any) => {
      if (result) {
    console.log("deleteId", id)
    this.technologyService.deleteTechnology(id).subscribe(() => {
      this.fetchTechnologies();
    });
  }
})
  }


  checkAll(): void {
    this.technologyService.checkAllTechnologies(true).subscribe((response: any) => {
      this.fetchTechnologies();
    });
  }
  
  uncheckAll(): void {
    this.technologyService.checkAllTechnologies(false).subscribe((response: any) => {
      this.fetchTechnologies();
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }


  openAddTechnologyDialog(): void {
    const dialogRef = this.dialog.open(AddTechnologyComponent, {
      width: '300px', // Adjust the width as needed
      data: {
        dialogTitle: 'Add Technology',
        saveButtonText: 'Add Technology',
        refreshTable: () => {
          this.fetchTechnologies();
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: { refreshTable: () => void; }) => {
      if (result) {
        console.log("dailog close",result);
        if (typeof result.refreshTable === 'function') {
          result.refreshTable();
        }
      }
    });
  }
}