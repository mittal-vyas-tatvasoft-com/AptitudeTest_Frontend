import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FilesService } from '../../services/files.service';
import { FileElement } from '../../interfaces/file-element';
import { ImageService } from '../../services/image.service';
import { BreadcrumbsElement } from '../../interfaces/reports';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: boolean;
  @Input() path: string;
  @Input() breadcrumbsElement: BreadcrumbsElement[];

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{
    element: FileElement;
    moveTo: FileElement;
  }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  @Output() navigateThroughBreadCrumb = new EventEmitter<BreadcrumbsElement>();

  fileName = '';
  breakpoint: number;

  @ViewChild('box') previewWindow: any;

  constructor(
    public filesService: FilesService,
    public dialog: MatDialog,
    public imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.setBreakpoint();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (
      this.fileElements == null ||
      this.fileElements.length == 0 ||
      this.fileElements[0].isFolder
    ) {
      this.setBreakpoint();
    } else {
      this.breakpoint = 1;
    }
  }

  setBreakpoint() {
    if (window.innerWidth >= 992) {
      this.breakpoint = 3;
    } else if (window.innerWidth < 992 && window.innerWidth > 768) {
      this.breakpoint = 2;
    } else {
      this.breakpoint = 1;
    }
  }
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

  getImgPath(name: string | undefined) {
    if (name == undefined) return '';
    return `assets/images/${name}`;
  }

  downloadFile(name: string) {
    this.imageService.download(this.filesService.getImagePath(name), name);
  }

  breadcrumbsClick(element: BreadcrumbsElement, index: number) {
    if (index === this.breadcrumbsElement.length - 1) {
      return;
    }
    this.navigateThroughBreadCrumb.emit(element);
  }
}
