export interface ProfileModel {
  id: number;
  name: string;
  status: boolean;
  createdDate?: string;
  createdBy?: number;
  updatedDate?: string | null;
  updatedBy?: number | null;
  isDeleted?: boolean;
}
