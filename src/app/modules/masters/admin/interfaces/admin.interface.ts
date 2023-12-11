export interface AdminModel {
  id: number;
  firstName: string;
  middleName: string;
  fatherName?: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  status: boolean;
  createdDate?: string;
  createdBy?: number;
  updatedDate?: string | null;
  updatedBy?: number | null;
  isDeleted?: boolean;
}

export interface SearchModel {
  searchValue: string;
  statusValue: boolean | null;
}
