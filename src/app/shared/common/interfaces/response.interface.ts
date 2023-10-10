export interface ResponseModel<T> {
    result: boolean;
    statusCode: number;
    message: string;
    data: T;
  }
  