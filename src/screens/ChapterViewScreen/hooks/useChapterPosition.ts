import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { ChapterPosition } from '../interfaces/ChapterPosition';
import { useEffect, useRef, useState } from 'react';
import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { useInterval } from '@/common/hooks/useInterval';
import { useAppState } from '@/common/hooks/useAppState';
import { AppStateStatusType } from '@/common/enums/AppStateStatus';
import { SettingManager } from '@/settings/classes/SettingManager';
import { SettingType } from '@/settings/enums/SettingType';

export function useChapterPosition(
  chapter: ChapterInterface,
  option: ChapterOptionInterface,
  getPosition: () => ChapterPosition | undefined,
  setPosition: (pos: ChapterPosition) => void,
) {
  const [restorePosition, setRestorePosition] = useState(false);
  const lastPosition = useRef<ChapterPosition | undefined>(undefined);
  const pauseAutoSave = useRef(false);
  const autoRestorePosition = useRef(
    (SettingManager.getOption(
      SettingType.AUTOMATIC_RESTORE_SAVED_POSITION,
      'boolean',
    ) as boolean) ?? false,
  );

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

  const restoreLastPosition = () => {
    setRestorePosition(false);

    if (lastPosition.current) {
      setPosition(lastPosition.current);

      setTimeout(() => {
        autoSave.start();
      }, 1000);
    }
  };

  const noRestoreLastPosition = () => {
    setRestorePosition(false);
    saveCurrentPosition();
    autoSave.start();
  };

  const checkLastPosition = async () => {
    try {
      const position = await BookChapterHistory.getChapterPosition(
        chapter.id!,
        option.url,
      );

      if (!position) {
        autoSave.start();
        return;
      }

      lastPosition.current = {
        positionX: position.progressX,
        positionY: position.progressY,
        positionZ: position.progressZ,
        progress: position.progress,
      };
      setRestorePosition(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkLastPosition();
  }, []);

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
    restorePosition,
    autoRestorePosition: autoRestorePosition.current,
    saveCurrentPosition,
    restoreLastPosition,
    noRestoreLastPosition,
  };
}
