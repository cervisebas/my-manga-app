import { DrizzleError } from 'drizzle-orm';
import { DatabaseErrorCode } from '../enums/DatabaseErrorCode';
import { DatabaseErrorMessages } from '../translate/DatabaseErrorMessages';

export class DatabaseError {
  private message: string | object | unknown;

  constructor(message: typeof this.message) {
    this.message = message;
  }

  public getError() {
    if (this.message instanceof DrizzleError) {
      return DatabaseErrorCode.DATABASE_ERROR;
    }

    if (this.message === null || this.message === undefined) {
      return DatabaseErrorCode.NO_FOUND;
    }

    return DatabaseErrorCode.INTERNAL_ERROR;
  }

  public getMessage() {
    return DatabaseErrorMessages[this.getError()];
  }
}
