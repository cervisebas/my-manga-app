import React, { useState } from 'react';
import { BookStaffInterface } from '@/api/shared/interfaces/BookStaffInterface';
import { UImage } from '@/common/components/UniwindElements';
import { View } from 'react-native';
import { Divider, IconButton, Text, TouchableRipple } from 'react-native-paper';
import { ItemWithIcon } from '@/common/components/ItemWithIcon';
import { goToAuthorBooks } from '@/utils/goToAuthorBooks';
import { IScrappingService } from '@/api/interfaces/IScrappingService';

interface IProps {
  authors: BookStaffInterface[];
  scrapper: IScrappingService;
}

export function BookInfoAutors(props: IProps) {
  const [show, setShow] = useState(true);

  const toggleShow = () => {
    setShow((val) => !val);
  };

  return (
    <View className={'gap-[8]'}>
      <TouchableRipple borderless onPress={toggleShow}>
        <View className={'flex-row justify-between items-center'}>
          <Text variant={'titleLarge'}>Autores</Text>
          <IconButton
            icon={show ? 'menu-up-outline' : 'menu-down-outline'}
            animated={true}
            onPress={toggleShow}
          />
        </View>
      </TouchableRipple>

      {show && (
        <View className={'w-full flex-col'}>
          {props.authors.map((author, index, array) => (
            <React.Fragment
              key={`staff-item-${author.url}-${author.work_position}`}
            >
              <ItemWithIcon
                title={author.name}
                description={author.work_position}
                fixHeight={74}
                left={
                  author.picture
                    ? (lProps) => (
                        <UImage
                          {...lProps}
                          style={lProps.style}
                          className={'size-[50] rounded-full'}
                          source={{
                            uri: author.picture,
                          }}
                        />
                      )
                    : undefined
                }
                onPress={
                  props.scrapper.showAuthorAction
                    ? () => {
                        goToAuthorBooks(author, props.scrapper);
                      }
                    : undefined
                }
              />

              {array?.[index + 1] && <Divider className={'mx-[12]'} />}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
}
