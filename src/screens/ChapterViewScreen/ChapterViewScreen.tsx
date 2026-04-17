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
import { ChapterViewVisualizer } from './components/ChapterViewVisualizer';

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

  // Hooks
  const theme = useTheme();
  const scrapper = getInstanceById(params.instance);
  const { images, progress, loading } = useLoadChapterImages(
    scrapper,
    params.images,
    params.bookInfo.path,
  );

  // Refs
  const unmount = useRef(false);
  const progressRef = useRef<string | number | undefined>(undefined);

  // Variables
  const title =
    `Capítulo ${params.chapter.chapter_number}` +
    (params.chapter.title ? ` - ${params.chapter.title}` : '');

  // Effects
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
      toast.dismiss(progressRef.current);
    }
  }, [progress, loading]);

  useEffect(() => {
    return () => {
      unmount.current = true;
      toast.dismiss(progressRef.current);
    };
  }, []);

  return (
    <View
      className={'flex-1'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <AppbarHeader>
        <Appbar.BackAction onPress={props.navigation.goBack} />
        <Appbar.Content title={title} />
        <Appbar.Action icon={'cog-outline'} />
      </AppbarHeader>
      <ChapterViewVisualizer images={images} />
    </View>
  );
}
