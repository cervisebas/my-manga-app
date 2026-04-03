import { BookStatus } from '../enums/BookStatus';

export const BookStatusTranslate = {
  [BookStatus.PUBLICANDOSE]: 'Publicandose',
  [BookStatus.FINALIZADO]: 'Finalizado',
  [BookStatus.CANCELADO]: 'Cancelado',
  [BookStatus.EN_ESPERA]: 'En_espera',
  [BookStatus.PAUSADO]: 'Pausado',
  [BookStatus.ACTIVO]: 'Activo',
  [BookStatus.ABANDONADO]: 'Abandonado',
};
