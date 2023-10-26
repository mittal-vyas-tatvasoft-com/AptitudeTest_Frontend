export interface CollegeModel {
    id: number;
    name: string;
    abbreviation: string;
    status: boolean;
    createdDate: string;
    createdBy: number;
    updatedDate: string | null;
    updatedBy: number | null;
    isDeleted: boolean;
  }