import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BreadcrumbsElement, ITestFolder } from '../interfaces/reports';
import { ReportLevels } from '../interfaces/reports-levels.enum';
import { FileElement } from '../interfaces/file-element';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  level: ReportLevels = 1;

  test?: ITestFolder;
  user?: ITestFolder;
  userDir?: ITestFolder;
  testPath = 'Tests';
  breadcrumbsElement: BreadcrumbsElement[] = [];
  navigateToFolder(event: FileElement) {
    this.updateIds(event);
    this.level += 1;
  }

  navigateUp() {
    this.level -= 1;
  }

  navigate(element: BreadcrumbsElement) {
    this.level -= 1;
    const isFolder = this.level != ReportLevels.Files;
    let fileElement: FileElement = {
      isFolder: isFolder,
      name: element.path,
      data: element,
      id: element.id,
    };
    this.updateIds(fileElement);
    this.level = element.level;
  }

  updateIds(fileElement: FileElement) {
    console.log('Updating', this.level, fileElement);
    switch (this.level) {
      case ReportLevels.Test:
        this.test = fileElement.data;
        this.user = undefined;
        this.userDir = undefined;
        break;

      case ReportLevels.User:
        this.user = fileElement.data;
        this.userDir = undefined;
        break;

      case ReportLevels.UserDir:
        this.userDir = fileElement.data;
        break;

      default:
        break;
    }
  }

  getBreadcrumbs() {
    switch (this.level) {
      case ReportLevels.Test:
        this.breadcrumbsElement = [
          { level: ReportLevels.Test, path: this.testPath },
        ];
        return this.breadcrumbsElement;

      case ReportLevels.User:
        this.breadcrumbsElement = [
          { level: ReportLevels.Test, path: this.testPath },
          {
            level: ReportLevels.User,
            path: this.test?.name!,
            id: this.test?.id,
          },
        ];
        return this.breadcrumbsElement;

      case ReportLevels.UserDir:
        this.breadcrumbsElement = [
          { level: ReportLevels.Test, path: this.testPath },
          {
            level: ReportLevels.User,
            path: this.test?.name!,
            id: this.test?.id,
          },
          {
            level: ReportLevels.UserDir,
            path: this.user?.name!,
            id: this.user?.id,
          },
        ];
        return this.breadcrumbsElement;

      case ReportLevels.Files:
        this.breadcrumbsElement = [
          { level: ReportLevels.Test, path: this.testPath },
          {
            level: ReportLevels.User,
            path: this.test?.name!,
            id: this.test?.id,
          },
          {
            level: ReportLevels.UserDir,
            path: this.user?.name!,
            id: this.user?.id,
          },
          {
            level: ReportLevels.UserDir,
            path: this.userDir?.name!,
            id: this.userDir?.id,
          },
        ];
        return this.breadcrumbsElement;

      default:
        return this.breadcrumbsElement;
    }
  }

  getIconPath(name: string) {
    const re = /(?:\.([^.]+))?$/;
    let type: any = re.exec(name);

    if (type != undefined) {
      type = type[1];
      if (type == 'svg') {
        return 'file-type-svg.svg';
      } else if (type == 'png') {
        return 'file-type-png.svg';
      } else if (type == 'jpg' || type == 'jpeg') {
        return 'file-type-jpg.svg';
      }
    }

    return undefined;
  }

  getImagePath(name: string) {
    return `${environment.imageBase}/images/${this.test?.id}/${this.user?.id}/${this.userDir?.name}/${name}`;
  }

  resetAll() {
    this.test = undefined;
    this.user = undefined;
    this.userDir = undefined;
    this.level = ReportLevels.Test;
  }
}
