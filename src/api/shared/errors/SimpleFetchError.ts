import { ApiErrorCode } from '../enums/ApiErrorCode';
import { ApiErrorMessages } from '../translate/ApiErrorMessages';

export class SimpleFetchError {
  private status: number | null;

  constructor(message: typeof this.status) {
    this.status = message;
  }

  public getError() {
    if (this.status === null) {
      return ApiErrorCode.INTERNAL_ERROR;
    }

    switch (this.status) {
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

  public getMessage() {
    return ApiErrorMessages[this.getError()];
  }
}
