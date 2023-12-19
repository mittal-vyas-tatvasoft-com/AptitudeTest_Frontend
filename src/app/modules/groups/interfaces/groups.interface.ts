export interface GroupsModel {
  id: number;
  name: string;
  numberOfStudentsInGroup?: number;
  isDefault: boolean;
  collegesUnderGroup?: CollegesUnderGroup[];
}

export interface CollegesUnderGroup {
  id: number;
  name: string;
  numberOfStudentsInCollege: number;
}
