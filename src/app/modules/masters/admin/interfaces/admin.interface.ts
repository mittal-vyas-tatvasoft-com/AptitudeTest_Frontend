export interface AdminModel {
  adminId: number;
  firstName: string;
  middleName: string;
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
