import { AxiosError } from 'axios';
import { ErrorCode } from '../enums/ErrorCode';
import { ErrorMensages } from '../translate/ErrorMessages';

export class ApiError {
  private message: string | object | unknown;

  constructor(message: typeof this.message) {
    this.message = message;
  }

  public getError() {
    if (this.message instanceof AxiosError) {
      if (!this.message.response) {
        return ErrorCode.NO_INTERNET;
      }

      switch (this.message.response?.status) {
        case 500:
        case 502:
        case 503:
          return ErrorCode.SERVICE_NOT_AVAILABLE;

        case 400:
        case 404:
          return ErrorCode.NOT_FOUND;

        case 401:
        case 403:
          return ErrorCode.BLOCKED;
      }

      return ErrorCode.UNKNOWN;
    }

    return ErrorCode.INTERNAL_ERROR;
  }

  public getMessage() {
    return ErrorMensages[this.getError()];
  }
}
