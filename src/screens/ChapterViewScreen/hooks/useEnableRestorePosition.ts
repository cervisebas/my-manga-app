import { BookChapterHistory } from '@/database/classes/BookChapterHistory';
import { useEffect, useRef, useState } from 'react';
import { ChapterPosition } from '../interfaces/ChapterPosition';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';

interface IProps {
  option: ChapterOptionInterface;
  chapter: ChapterInterface;
  imagesTotalHeight: number;
  setPosition(pos: ChapterPosition): void;
  startAutoSave(): void;
  saveCurrentPosition(): void;
}

export function useEnableRestorePosition({
  option,
  chapter,
  imagesTotalHeight,
  setPosition,
  startAutoSave,
  saveCurrentPosition,
}: IProps) {
  const [restorePosition, setRestorePosition] = useState(false);
  const [enableRestorePosition, setEnableRestorePosition] = useState(false);

  const lastPosition = useRef<ChapterPosition | undefined>(undefined);

  const checkEnableRestorePosition = () => {
    if (!lastPosition.current) {
      return;
    }

    const lastPositionY = lastPosition.current.positionY * -1;

    if (lastPositionY <= imagesTotalHeight && !enableRestorePosition) {
      setEnableRestorePosition(true);
    }
  };

  const checkLastPosition = async () => {
    try {
      const position = await BookChapterHistory.getChapterPosition(
        chapter.id!,
        option.url,
      );

      if (!position) {
        startAutoSave();
        return;
      }

      lastPosition.current = {
        positionX: position.progressX,
        positionY: position.progressY,
        positionZ: position.progressZ,
        progress: position.progress,
      };
      setRestorePosition(true);
      checkEnableRestorePosition();
    } catch (error) {
      console.error(error);
    }
  };

  const restoreLastPosition = () => {
    setRestorePosition(false);

    if (lastPosition.current) {
      setPosition(lastPosition.current);

      setTimeout(() => {
        startAutoSave();
      }, 1000);
    }
  };

  const noRestoreLastPosition = () => {
    setRestorePosition(false);
    saveCurrentPosition();
    startAutoSave();
  };

  useEffect(() => {
    checkLastPosition();
  }, []);

  useEffect(() => {
    checkEnableRestorePosition();
  }, [imagesTotalHeight]);

  return {
    restorePosition,
    enableRestorePosition,
    restoreLastPosition,
    noRestoreLastPosition,
  };
}
