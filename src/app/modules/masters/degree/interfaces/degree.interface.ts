export interface DegreeModel {
  id: number;
  name: string;
  level: number;
  streams: string[];
  status: boolean;
  createdDate?: string;
  createdBy?: number;
  updatedDate?: string | null;
  updatedBy?: number | null;
  isDeleted?: boolean;
}
