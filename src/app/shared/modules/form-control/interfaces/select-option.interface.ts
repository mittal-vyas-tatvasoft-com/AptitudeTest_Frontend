export interface SelectOption {
  id: number | string | boolean;
  key?: string | boolean;
  value: string;
  isDefault?: boolean;
  degreeId?: number;
}
