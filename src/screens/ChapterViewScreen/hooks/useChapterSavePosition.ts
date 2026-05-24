import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { ChapterPosition } from '../interfaces/ChapterPosition';
import { useRef } from 'react';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { useInterval } from '@/common/hooks/useInterval';
import { useAppState } from '@/common/hooks/useAppState';
import { AppStateStatusType } from '@/common/enums/AppStateStatus';

export function useChapterSavePosition(
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  getPosition: () => ChapterPosition | undefined,
) {
  const pauseAutoSave = useRef(false);

  const saveCurrentPosition = () => {
    if (pauseAutoSave.current) {
      return;
    }

    const position = getPosition();

    if (position) {
      console.info(
        `Guardando posición: [X => ${position.positionX} | Y => ${position.positionY} | Z => ${position.positionZ} | P => ${position.progress}]`,
      );

      BookChapterHistory.updateChapterPosition(
        chapter.id!,
        option.url,
        position.positionX,
        position.positionY,
        position.positionZ,
        position.progress,
      );
    }
  };

  const autoSave = useInterval(() => saveCurrentPosition(), 60000, false);

  useAppState(
    (state) => {
      const _pauseAutoSave = state === AppStateStatusType.BACKGROUND;

      console.info('Auto save Inited ->', autoSave.started());
      console.info('Pause auto save ->', _pauseAutoSave);
      if (_pauseAutoSave && autoSave.started()) {
        saveCurrentPosition();
      }

      pauseAutoSave.current = _pauseAutoSave;
    },
    [AppStateStatusType.ACTIVE, AppStateStatusType.BACKGROUND],
  );

  return {
    saveCurrentPosition,
    startAutoSave() {
      if (!autoSave.started()) {
        autoSave.start();
      }
    },
  };
}
