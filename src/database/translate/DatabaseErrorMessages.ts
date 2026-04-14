import { DatabaseErrorCode } from '../enums/DatabaseErrorCode';

export const DatabaseErrorMessages = {
  [DatabaseErrorCode.DATABASE_ERROR]:
    'Ocurrió un error al acceder a base de datos',
  [DatabaseErrorCode.NO_FOUND]: 'No se encontro almacenado el dato solicitado',
  [DatabaseErrorCode.INTERNAL_ERROR]:
    'Ocurrio un error interno al consultar a base de datos',
};
