import { ErrorCode } from '../enums/ErrorCode';

export const ErrorMensages = {
  [ErrorCode.NO_INTERNET]: 'Sin conexión a internet',
  [ErrorCode.SERVICE_NOT_AVAILABLE]: 'Servicio no disponible',
  [ErrorCode.NOT_FOUND]: 'No se encontro el recurso',
  [ErrorCode.BLOCKED]: 'El servicio bloqueo la petición',
  [ErrorCode.UNKNOWN]: 'Eroor desconocido',
  [ErrorCode.INTERNAL_ERROR]: 'Ocurrio un error interno',
};
