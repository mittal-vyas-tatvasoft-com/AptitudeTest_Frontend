import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FilesService } from '../../services/files.service';
import { FileElement } from '../../interfaces/file-element';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent {
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: boolean;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{
    element: FileElement;
    moveTo: FileElement;
  }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();

  fileName = '';

  @ViewChild('box') previewWindow: any;

  constructor(public filesService: FilesService, public dialog: MatDialog, public imageService: ImageService) {}

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    } else {
      this.fileName = element.name;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.height = '90%';
      dialogConfig.minWidth = '50%';
      dialogConfig.maxWidth = '90vw';

      this.dialog.open(this.previewWindow, dialogConfig);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  getImgPath(name: string | undefined) {
    if (name == undefined) return '';

    return `assets/images/${name}`;
  }

  downloadFile(name: string) {
    this.imageService.download(this.filesService.getImagePath(name), name);
  }
}
