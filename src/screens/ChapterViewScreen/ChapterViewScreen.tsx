import { BookInfoInterface } from '@/api/shared/interfaces/BookInfoInterface';
import { ChapterInterface } from '@/api/shared/interfaces/ChapterInterface';
import { ChapterOptionInterface } from '@/api/shared/interfaces/ChapterOptionInterface';
import { AppbarHeader } from '@/common/components/AppbarHeader';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { ParamListBase } from '@react-navigation/native';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useLoadChapterImages } from './hooks/useLoadChapterImages';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner-native';
import {
  ChapterViewVisualizer,
  ChapterViewVisualizerRef,
} from './components/ChapterViewVisualizer';
import { ChapterSheetOptions } from './classes/ChapterSheetOptions';
import { useChapterHistory } from './hooks/useChapterHistory';
import { useChapterPosition } from './hooks/useChapterPosition';
import { MiniBanner } from '@/common/components/MiniBanner';
import { usePreventBackNavigation } from '@/common/hooks/usePreventBackNavigation';

type IProps = NativeBottomTabScreenProps<ParamListBase, 'chapter-view'>;

export interface ChapterViewScreenParams {
  bookInfo: BookInfoInterface;
  chapter: ChapterInterface;
  option: ChapterOptionInterface;
  instance: string;
  images: string[];
}

export function ChapterViewScreen(props: IProps) {
  const params = props.route.params as ChapterViewScreenParams;

  // Refs
  const unmount = useRef(false);
  const progressRef = useRef<string | number | undefined>(undefined);
  const optionsRef = useRef<ChapterSheetOptions | undefined>(undefined);

  const refChapterViewVisualizer = useRef<ChapterViewVisualizerRef>(null);

  // Hooks
  const theme = useTheme();
  const scrapper = getInstanceById(params.instance);
  const { images, progress, loading } = useLoadChapterImages(
    scrapper,
    params.images,
    params.bookInfo.path,
  );

  const {
    restorePosition,
    autoRestorePosition,
    restoreLastPosition,
    noRestoreLastPosition,
    saveCurrentPosition,
  } = useChapterPosition(
    params.chapter,
    params.option,
    () => refChapterViewVisualizer.current?.getPosition(),
    (pos) => refChapterViewVisualizer.current?.setPosition(pos),
  );

  // Variables
  const title =
    `Capítulo ${params.chapter.chapter_number}` +
    (params.chapter.title ? ` - ${params.chapter.title}` : '');

  // Metodos
  const showOptions = () => {
    if (!optionsRef.current) {
      optionsRef.current = new ChapterSheetOptions(
        scrapper,
        props.navigation as never,
        params.bookInfo,
        params.chapter,
        params.option,
      );
    }

    optionsRef.current.show();
  };

  // Effects
  useChapterHistory(params.chapter);

  useEffect(() => {
    if (!unmount.current) {
      progressRef.current = toast.loading(
        `Cargando imagenes: ${progress} de ${params.images.length}`,
        {
          id: progressRef.current,
          dismissible: false,
          duration: 1000000,
        },
      );
    }

    if (!loading) {
      setTimeout(() => {
        toast.dismiss(progressRef.current);
      }, 150);
    }
  }, [progress, loading]);

  useEffect(() => {
    return () => {
      unmount.current = true;
      toast.dismiss(progressRef.current);
    };
  }, []);

  useEffect(() => {
    if (restorePosition && !loading && autoRestorePosition) {
      restoreLastPosition();
    }
  }, [restorePosition, loading, autoRestorePosition]);

  // Back Handler
  usePreventBackNavigation(props.navigation as never, true, (removePrevent) => {
    saveCurrentPosition();

    setTimeout(() => {
      removePrevent?.();
      props.navigation.goBack();
    }, 10);
  });

  return (
    <View
      className={'flex-1'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={title} />
        <Appbar.Action icon={'cog-outline'} onPress={showOptions} />
      </AppbarHeader>

      <MiniBanner
        visible={restorePosition && autoRestorePosition}
        loading={true}
        message={'Esperando para restaurar ultima posición'}
        actions={[]}
      />

      <MiniBanner
        visible={restorePosition && !autoRestorePosition}
        message={'¿Reestablecer ultima posición?'}
        actions={[
          {
            label: 'No',
            onPress() {
              noRestoreLastPosition();
            },
          },
          {
            label: 'Si',
            loading: loading,
            mode: 'contained',
            onPress() {
              restoreLastPosition();
            },
          },
        ]}
      />

      <ChapterViewVisualizer ref={refChapterViewVisualizer} images={images} />
    </View>
  );
}
