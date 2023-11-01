export interface CandidateModel {
    userId: number;
    firstName: string;
    lastName: string;
    fatherName: string;
    email: string;
    phoneNumber: number;
    groupId: number;
    collegeId: number;
    gender: number;
    status: boolean;
    createdYear: number;
    createdBy: number;
}

export interface DropdownItem {
    id: number;
    name: string;
}