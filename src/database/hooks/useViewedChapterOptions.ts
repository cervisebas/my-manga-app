import { useEffect, useRef, useState } from 'react';
import { ChapterViewedInterface } from '../interfaces/ChapterViewedInterface';
import { ChapterViewedOptionInterface } from '../interfaces/ChapterViewedOptionInterface';
import { useTableChanges } from './useTableChange';
import { DatabaseTableName } from '../enums/DatabaseTableName';
import { BookChapterHistory } from '../classes/BookChapterHistory';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';

export function useViewedChapterOptions(chapterList: ChapterViewedInterface[]) {
  const [chapters, setChapters] = useState<ChapterViewedOptionInterface[]>([]);
  const lastOption = useRef<ChapterOptionInterface | undefined>(undefined);
  const avgOption = useRef<string>(undefined);

  const loadViewedChapterOptions = async () => {
    if (!chapterList.length) {
      return;
    }

    console.time('loadViewedChapterOptions:');
    // Evaluar cuales son los capitulos vistos
    const viewedChapters = new Map<number, number>();
    for (let i = 0; i < chapterList.length; i++) {
      const chapterItem = chapterList[i];

      if (chapterItem.viewed) {
        viewedChapters.set(i, chapterItem.id!);
      }
    }

    // Buscar en base de datos las ultimas opciones de los capitulos vistos
    const lastOptions = await BookChapterHistory.getLastOptionChapters(
      Array.from(viewedChapters.values()),
    );

    // Remapear el arreglo y añadir los datos traidos de la base de datos
    const _chapterList = [...chapterList] as ChapterViewedOptionInterface[];

    for (const [index, chapterId] of Array.from(viewedChapters.entries())) {
      const lastOption = lastOptions.get(chapterId);

      if (!lastOption) {
        continue;
      }

      _chapterList[index].lastOption = lastOption;
    }

    // Guardar resultado
    setChapters(_chapterList);
    calculeOptions(_chapterList, viewedChapters);
    console.timeEnd('loadViewedChapterOptions:');
  };

  const calculeOptions = (
    _chapters: ChapterViewedOptionInterface[],
    viewedChapters: Map<number, number>,
  ) => {
    lastOption.current =
      _chapters[Array.from(viewedChapters.keys())[0]].lastOption;

    const usedOptions = new Map<string, number>();

    for (const index of Array.from(viewedChapters.keys())) {
      const lastOption = _chapters[index].lastOption;

      if (lastOption && lastOption.title) {
        const currentValue = usedOptions.get(lastOption.title);

        if (currentValue) {
          usedOptions.set(lastOption.title, currentValue + 1);
          continue;
        }

        usedOptions.set(lastOption.title, 1);
      }
    }

    const orderedUsedOptions = Array.from(usedOptions.entries()).sort(
      (a, b) => b[1] - a[1],
    );

    if (orderedUsedOptions[0][1] !== 1) {
      avgOption.current = orderedUsedOptions[0][0];
    }
  };

  // External Methods
  const getLastOption = () => {
    return lastOption.current;
  };

  const getAvgOption = () => {
    return avgOption.current;
  };

  useTableChanges(
    DatabaseTableName.BOOK_USER_CHAPTER_BOOK_HISTORY,
    () => {
      loadViewedChapterOptions();
    },
    [chapterList],
  );

  useEffect(() => {
    console.info('Chapter List Changed');
    loadViewedChapterOptions();
  }, [chapterList]);

  return { chapters, getLastOption, getAvgOption };
}
