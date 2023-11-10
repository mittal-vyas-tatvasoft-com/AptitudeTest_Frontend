export interface GroupsModel {
  id: number;
  name: string;
  numberOfStudentsInGroup?: number;
  isDefault: boolean;
  collegesUnderGroup?: CollegesUnderGroup[];
}

export interface CollegesUnderGroup {
  name: string;
  numberOfStudentsInCollege: Number;
}
