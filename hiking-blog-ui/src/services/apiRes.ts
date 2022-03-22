export interface SuccessApiRes<T> {
  success: true;
  data: T;
}

export interface FailApiRes {
  success: false;
  error: string;
}

export type ApiRes<T> = SuccessApiRes<T> | FailApiRes;

export const isSuccessApi = <T>(apiRes: ApiRes<T>): apiRes is SuccessApiRes<T> => {
  return apiRes.success;
};
