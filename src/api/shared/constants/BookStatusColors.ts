import { BookStatus } from '../enums/BookStatus';

export const BookStatusColors = {
  [BookStatus.PUBLICANDOSE]: '#51a351',
  [BookStatus.FINALIZADO]: '#bd362f',
  [BookStatus.CANCELADO]: '#f89406',
  [BookStatus.EN_ESPERA]: '#2f96b4',

  [BookStatus.PAUSADO]: '#ffffff',
  [BookStatus.ACTIVO]: '#ffffff',
  [BookStatus.ABANDONADO]: '#ffffff',
};
