import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GroupsModel } from '../../interfaces/groups.interface';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
})
export class GroupCardComponent {
  @Input() groupData: GroupsModel;
  @Output() editClicked = new EventEmitter<GroupsModel>();
  @Output() deleteClicked = new EventEmitter<number>();
  @Output() setDefaultClicked = new EventEmitter<GroupsModel>();
  @Output() checkBoxClicked = new EventEmitter<number>();

  constructor(public dialog: MatDialog, private router: Router) {}

  handleEdit(group: GroupsModel) {
    this.editClicked.emit(group);
  }

  handleDelete(id: number) {
    this.deleteClicked.emit(id);
  }

  handleCheckBox(id: number) {
    this.checkBoxClicked.emit(id);
  }

  setAsDefault(group: GroupsModel) {
    this.setDefaultClicked.emit(group);
  }

  FilterGroupOrCollege(groupId: number, collegeId: number) {
    if (collegeId == 0) {
      this.router.navigate([`/candidate/${groupId}`]);
    } else {
      this.router.navigate([`/candidate/${groupId}/${collegeId}`]);
    }
  }
}
