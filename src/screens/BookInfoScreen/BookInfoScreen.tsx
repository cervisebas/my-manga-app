import SafeArea from '@/common/components/SafeArea';
import { useScrollEvent } from '@/common/hooks/useScrollEvent';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { BookInfoHeader } from './components/BookInfoHeader';
import useSafeArea from '@/common/hooks/useSafeArea';
import { modeAppbarHeight } from 'react-native-paper/src/components/Appbar/utils';
import { useTheme } from 'react-native-paper';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { BookInfoParams } from './interfaces/BookInfoParams';
import { UImage } from '@/common/components/UniwindElements';
import { BookInfoPicture } from './components/BookInfoPicture';

type IProps = NativeStackScreenProps<ParamListBase, 'book-info'>;

const COVER_HEIGHT = 240;

export function BookInfoScreen(props: IProps) {
  const params = props.route.params as BookInfoParams;

  const info = params.data;
  const instance = getInstanceById(params.instance);

  const { onScroll, scrollEvent } = useScrollEvent();
  const { top } = useSafeArea();
  const theme = useTheme();

  const coverSize = top + modeAppbarHeight['small'] + COVER_HEIGHT;

  return (
    <View className={'flex-1 relative'}>
      <BookInfoHeader
        title={info.title}
        className={'absolute top-0 left-0 z-10'}
        sizeHidden={coverSize}
        scrollEvent={scrollEvent}
        onBackAction={props.navigation.goBack}
      />
      <SafeArea.ScrollView
        expandDisableTop
        expandDisableLeft
        expandDisableRight
        className={'flex-1 z-1'}
        onScroll={onScroll}
      >
        <View className={'w-full relative'} style={{ height: coverSize }}>
          <UImage
            className={'w-full'}
            style={{
              backgroundColor: theme.colors.onSecondary,
              height: coverSize,
            }}
            source={{ uri: info.picture }}
            blurRadius={10}
          />

          <BookInfoPicture
            type={info.type}
            stars={info.stars}
            source={info.picture}
            language={info.language}
            onPress={() => {}}
          />
        </View>
        <SafeArea.View
          expandDisableTop
          expandArea={{ horizontal: 16 }}
          style={{ width: '100%' }}
        >
          <View className={'h-[3000] bg-red-500'} />
        </SafeArea.View>
      </SafeArea.ScrollView>
    </View>
  );
}
