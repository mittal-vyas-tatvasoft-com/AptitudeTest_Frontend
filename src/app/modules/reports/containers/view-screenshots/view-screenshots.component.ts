import { Component, OnInit } from '@angular/core';
import { StatusCode } from 'src/app/shared/common/enums';
import { ResponseModel } from 'src/app/shared/common/interfaces/response.interface';
import { ITestFile, ITestFolder } from '../../interfaces/reports';
import { ReportLevels } from '../../interfaces/reports-levels.enum';
import { FilesService } from '../../services/files.service';
import { ReportsApiService } from '../../services/reports-api.service';
import { FileElement } from '../../types/FileElement';

@Component({
  selector: 'app-view-screenshots',
  templateUrl: './view-screenshots.component.html',
  styleUrls: ['./view-screenshots.component.scss'],
})
export class ViewScreenshotsComponent implements OnInit {
  elements: FileElement[] = [];

  constructor(
    private reportsApiService: ReportsApiService,
    public filesService: FilesService
  ) {}

  ngOnInit() {
    this.filesService.resetAll();
    this.loadData();
  }

  checkRes(res: ResponseModel<ITestFolder[]>) {
    if (res.statusCode == StatusCode.Success) {
      this.elements = this.transformDataToElement(res.data);
    } else {
      this.elements = [];
    }
  }

  checkFileRes(res: ResponseModel<ITestFile[]>) {
    if (res.statusCode == StatusCode.Success) {
      this.elements = res.data.map((item) => ({
        isFolder: false,
        name: item.path,
        id: Math.floor(Math.random() * 100),
        data: item,
      }));
    } else {
      this.elements = [];
    }
  }

  loadData() {
    switch (this.filesService.level) {
      case ReportLevels.Test:
        {
          this.reportsApiService.getTests().subscribe({
            next: (res) => this.checkRes(res),
          });
        }
        break;

      case ReportLevels.User:
        if (this.filesService.test?.id != undefined) {
          this.reportsApiService.getUsers(this.filesService.test.id).subscribe({
            next: (res) => this.checkRes(res),
          });
        }
        break;

      case ReportLevels.UserDir:
        if (
          this.filesService.test?.id != undefined &&
          this.filesService.user?.id != undefined
        ) {
          this.reportsApiService
            .getUserDirs(this.filesService.test.id, this.filesService.user.id)
            .subscribe({
              next: (res) => this.checkRes(res),
            });
        }
        break;

      case ReportLevels.Files:
        if (
          this.filesService.test?.id != undefined &&
          this.filesService.user?.id != undefined &&
          this.filesService.userDir?.id != undefined
        ) {
          this.reportsApiService
            .getFiles(
              this.filesService.test.id,
              this.filesService.user.id,
              this.filesService.userDir.id
            )
            .subscribe({
              next: (res) => this.checkFileRes(res),
            });
        }
        break;

      default:
        break;
    }
  }

  transformDataToElement(data: ITestFolder[]): FileElement[] {
    const isFolder = this.filesService.level != ReportLevels.Files;

    return data.map((item) => ({
      isFolder: isFolder,
      name: item.name,
      id: item.id,
      data: item,
    }));
  }

  navigateToFolder(event: FileElement) {
    this.filesService.navigateToFolder(event);
    this.loadData();
  }

  navigateUp() {
    this.filesService.navigateUp();
    this.loadData();
  }
}
