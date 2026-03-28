import React from 'react';
import { View } from 'react-native';
import { UImage } from './UniwindElements';

import Cover from '@/assets/cbd2ace0-5647-4bff-8632-64ace496130e.webp';

export const BookItem = React.memo(function () {
  return (
    <View className={'flex-col relative py-2 px-4 bg-green-500'}>
      <View className={'overflow-hidden rounded-xl shadow-xs'}>
        <UImage className={'aspect-5/7'} source={Cover} />
      </View>
    </View>
  );
});
