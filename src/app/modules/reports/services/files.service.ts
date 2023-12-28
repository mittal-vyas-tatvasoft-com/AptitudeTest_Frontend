import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITestFolder } from '../interfaces/reports';
import { ReportLevels } from '../interfaces/reports-levels.enum';
import { FileElement } from '../interfaces/file-element';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  level: ReportLevels = 1;

  test?: ITestFolder;
  user?: ITestFolder;
  userDir?: ITestFolder;

  navigateToFolder(event: FileElement) {
    this.updateIds(event);
    this.level += 1;
  }

  navigateUp() {
    this.level -= 1;
  }

  updateIds(fileElement: FileElement) {
    switch(this.level) {
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

  getPath() {
    switch(this.level) {
      case ReportLevels.Test:
        return '';

      case ReportLevels.User:
        return `${this.test?.name}`;

      case ReportLevels.UserDir:
        return `${this.test?.name} > ${this.user?.name}`;

      case ReportLevels.Files:
        return `${this.test?.name} > ${this.user?.name} > ${this.userDir?.name}`;

      default:
        return '';
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
    return `${environment.imageBase}/images/${this.test?.id}/${this.user?.id}/${this.userDir?.name}/${name}`
  }

  resetAll() {
    this.test = undefined;
    this.user = undefined;
    this.userDir = undefined;
    this.level = ReportLevels.Test;
  }
}
