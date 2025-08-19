import type { AxiosRequestConfig, AxiosResponse } from "axios";

export default class BaseService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public get<T>(_: string, __?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return Promise.resolve({} as AxiosResponse<T>);
  }

  public post<T>(_: string, __: unknown, ___?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return Promise.resolve({} as AxiosResponse<T>);
  }

  public put<T>(_: string, __: unknown, ___?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return Promise.resolve({} as AxiosResponse<T>);
  }

  public delete<T>(_: string, __?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return Promise.resolve({} as AxiosResponse<T>);
  }
}
