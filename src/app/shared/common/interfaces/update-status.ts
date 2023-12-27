export interface UpdateStatus {
  id: number;
  status: boolean;
}

export interface BulkStatusUpdate {
  idList: number[];
  status: boolean;
}
