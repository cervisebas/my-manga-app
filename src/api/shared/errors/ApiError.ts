import { AxiosError } from 'axios';
import { ApiErrorCode } from '../enums/ApiErrorCode';
import { ApiErrorMessages } from '../translate/ApiErrorMessages';

export class ApiError {
  private message: string | object | unknown;

  constructor(message: typeof this.message) {
    this.message = message;
  }

  public getError() {
    if (this.message instanceof AxiosError) {
      if (!this.message.response) {
        return ApiErrorCode.NO_INTERNET;
      }

      switch (this.message.response?.status) {
        case 500:
        case 502:
        case 503:
          return ApiErrorCode.SERVICE_NOT_AVAILABLE;

        case 400:
        case 404:
          return ApiErrorCode.NOT_FOUND;

        case 401:
        case 403:
          return ApiErrorCode.BLOCKED;
      }

      return ApiErrorCode.UNKNOWN;
    }

    return ApiErrorCode.INTERNAL_ERROR;
  }

  public getMessage() {
    return ApiErrorMessages[this.getError()];
  }
}
