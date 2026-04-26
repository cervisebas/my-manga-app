import SafeArea from '@/common/components/SafeArea';
import { useScrollEvent } from '@/common/hooks/useScrollEvent';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { BookInfoHeader } from './components/BookInfoHeader';
import { useSafeArea } from '@/common/hooks/useSafeArea';
import { modeAppbarHeight } from 'react-native-paper/src/components/Appbar/utils';
import { Chip, Divider, Text, useTheme } from 'react-native-paper';
import { getInstanceById } from '@/api/utils/getInstanceById';
import { BookInfoParams } from './interfaces/BookInfoParams';
import { UImage, USafeAreaFAB } from '@/common/components/UniwindElements';
import { BookInfoPicture } from './components/BookInfoPicture';
import { useBookInfo } from './hooks/useBookInfo';
import { LoadingErrorContent } from '@/common/components/LoadingErrorContent';
import React from 'react';
import { BookStatusColors } from '@/api/shared/constants/BookStatusColors';
import { BookStatusTranslate } from '@/api/shared/translate/BookStatusTranslate';
import { BookInfoDescription } from './components/BookInfoDescription';
import { BookInfoLanguages } from './components/BookInfoLanguages';
import { BookInfoChapters } from './components/BookInfoChapters';
import { Language } from '@/api/shared/enums/Language';
import { BookInfoTranslateProgress } from './components/BookInfoTranslateProgress';
import { refImageViewer } from '@/constants/Refs';
import { BookInfoStatus } from './components/BookInfoStatus';

type IProps = NativeStackScreenProps<ParamListBase, 'book-info'>;

const COVER_HEIGHT = 240;
const PREFFER_LANGUAGE = [Language.ES, Language.MX];

export function BookInfoScreen(props: IProps) {
  const params = props.route.params as BookInfoParams;

  // Hooks de interfaz
  const { onScroll, scrollEvent } = useScrollEvent();
  const { top } = useSafeArea();
  const theme = useTheme();

  // Variables de interfaz
  const coverSize = top + modeAppbarHeight['small'] + COVER_HEIGHT;

  // Variables de informacion
  const info = params.data;
  const scrapper = getInstanceById(params.instance);

  // Hook de datos
  const { data, loading, refresh, error, loadData } = useBookInfo(
    scrapper,
    info,
  );

  const altTitles = Array.isArray(data.altTitles)
    ? data.altTitles
    : Object.values(data.altTitles);

  return (
    <View
      className={'flex-1 relative'}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <BookInfoHeader
        title={data.title}
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
        contentContainerStyle={{
          flexGrow: loading || error ? 1 : undefined,
        }}
        onScroll={onScroll}
      >
        <View className={'w-full relative'} style={{ height: coverSize }}>
          <UImage
            className={'w-full'}
            style={{
              backgroundColor: theme.colors.onSecondary,
              height: coverSize,
            }}
            source={{ uri: data.wallpaper ?? data.picture }}
            blurRadius={10}
          />

          <BookInfoPicture
            type={data.type}
            stars={data.stars}
            source={data.picture}
            language={data.language}
            onPress={() => {
              refImageViewer.current?.open([
                data.picture,
                data.wallpaper ?? data.picture,
              ]);
            }}
          />
        </View>

        <BookInfoStatus id_bookInfo={info.id ?? data.id} />

        <LoadingErrorContent loading={loading} error={error} onRetry={loadData}>
          <SafeArea.View
            expandDisableTop
            expandArea={{ horizontal: 16, bottom: 60 }}
            className={'w-full gap-[24] my-4'}
          >
            {/* TITLES */}
            <View className={'gap-[8]'}>
              <Text variant={'titleLarge'}>Títulos</Text>

              <Text variant={'titleMedium'}>{data?.title}</Text>

              {data.altTitles &&
                altTitles.map((altTitle, index) => (
                  <Text
                    key={`book-info-alt-title-${index}`}
                    variant={'labelMedium'}
                  >
                    {altTitle}
                  </Text>
                ))}
            </View>

            <Divider />

            {/* STATUS */}
            {data.status ? (
              <React.Fragment>
                <View className={'gap-[8] flex-col'}>
                  <Text variant={'titleLarge'}>Estado</Text>

                  <View className={'flex-row gap-[8] items-center'}>
                    <View
                      className={'size-[16] rounded-full'}
                      style={{ backgroundColor: BookStatusColors[data.status] }}
                    />

                    <Text variant={'labelLarge'}>
                      {BookStatusTranslate[data.status]}
                    </Text>
                  </View>
                </View>

                <Divider />
              </React.Fragment>
            ) : null}

            {/* DESCRIPTION */}
            <BookInfoDescription
              description={data.description}
              descriptionLang={data.descriptionLang}
            />

            <Divider />

            {/* GENEROS */}
            <View className={'gap-[8]'}>
              <Text variant={'titleLarge'}>Géneros</Text>

              <View
                className={'w-full flex-row flex-wrap justify-start gap-[12]'}
              >
                {data.genders?.map((gender) => (
                  <Chip
                    key={`gender-${gender.value}`}
                    mode={'outlined'}
                    // onPress={() => onPressGender(gender)}
                  >
                    {gender.name}
                  </Chip>
                ))}
              </View>
            </View>

            <Divider />

            {/* Lenguaje */}
            {data.languages && (
              <React.Fragment>
                <BookInfoTranslateProgress
                  chapters={data.chapters ?? []}
                  languages={PREFFER_LANGUAGE}
                />

                <Divider />
              </React.Fragment>
            )}

            {/* Lenguaje */}
            {data.languages && (
              <React.Fragment>
                <BookInfoLanguages languages={data.languages} />

                <Divider />
              </React.Fragment>
            )}

            {/* Capitulos */}
            <BookInfoChapters
              instance={scrapper}
              bookInfo={data}
              chapters={data.chapters}
            />
          </SafeArea.View>
        </LoadingErrorContent>
      </SafeArea.ScrollView>

      <USafeAreaFAB
        icon={'loading'}
        loading={true}
        visible={!loading && refresh}
        className={'absolute right-0 bottom-0 z-10'}
        expandDisableBottom={false}
        expandArea={{
          right: 16,
          bottom: 16,
        }}
      />
    </View>
  );
}
