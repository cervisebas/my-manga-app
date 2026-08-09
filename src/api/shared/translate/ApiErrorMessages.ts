import { ApiErrorCode } from '../enums/ApiErrorCode';

export const ApiErrorMessages = {
  [ApiErrorCode.NO_INTERNET]: 'Sin conexión a internet',
  [ApiErrorCode.SERVICE_NOT_AVAILABLE]: 'Servicio no disponible',
  [ApiErrorCode.NOT_FOUND]: 'No se encontro el recurso',
  [ApiErrorCode.BLOCKED]: 'El servicio bloqueo la petición',
  [ApiErrorCode.UNKNOWN]: 'Eroor desconocido',
  [ApiErrorCode.INTERNAL_ERROR]: 'Ocurrio un error interno',
  [ApiErrorCode.ORIGIN_UNREACHABLE]: 'El origen es inaccesible',
};
