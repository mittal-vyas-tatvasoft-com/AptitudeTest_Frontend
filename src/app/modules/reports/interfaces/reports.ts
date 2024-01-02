import { ReportLevels } from './reports-levels.enum';

export interface ITestFolder {
  id: number;
  name: string;
}

export interface ITestFile {
  path: string;
}

export interface IDeleteDirPayload {
  testId: number;
  level: ReportLevels;
  userId?: number;
  folder?: string;
  fileName?: string;
}

export interface BreadcrumbsElement {
  id?: number;
  path: string;
  level: number;
}
