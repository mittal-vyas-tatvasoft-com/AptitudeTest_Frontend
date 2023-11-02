export interface GroupsModel
{
    id : number;
    name : string;
    numberOfStudentsInGroup : number;
    isDefault : boolean;
    collegesUnderGroup : Array<CollegesUnderGroup>[];
}

export interface CollegesUnderGroup
{
    name : string;
    numberOfStudentsInCollege : Number;
}