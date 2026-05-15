import { ItemWithIcon } from '@/common/components/ItemWithIcon';
import { SettingItem } from '@/settings/classes/SettingItem';
import { useSettings } from '@/settings/hooks/useSettings';
import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native-paper';

interface IProps {
  instance: SettingItem;
}

const TITLE_NUMBER_OF_LINES = 2;
const DESCRIPTION_NUMBER_OF_LINES = 10;

export const SettingListItem = React.memo(function (props: IProps) {
  // Hooks
  const { setOption } = useSettings();

  // States
  const [description, setDescription] = useState(props.instance.description);
  const [value, setValue] = useState(props.instance.value);
  const [loading, setLoading] = useState(false);

  // Attributes
  const icon = props.instance.icon;
  const title = props.instance.title;
  const clickable = props.instance.clickable;

  const setNewValue = (newValue: unknown) => {
    setOption(props.instance.key, newValue);
    props.instance.setValue(newValue);
  };

  const onChange = () => {
    switch (props.instance.type) {
      case 'boolean': {
        const newValue = !props.instance.value;
        setNewValue(newValue);
        break;
      }

      default:
        console.warn('No implementado');
        break;
    }
  };

  useEffect(() => {
    props.instance.externalSetDescription = setDescription;
    props.instance.externalSetValue = setValue;
    props.instance.externalSetLoading = setLoading;

    if (props.instance.loadeable) {
      props.instance.loadData();
    }

    return () => {
      props.instance.externalSetDescription = undefined;
      props.instance.externalSetValue = undefined;
      props.instance.externalSetLoading = undefined;
    };
  }, []);

  return (
    <ItemWithIcon
      leftIcon={icon}
      title={title}
      titleNumberOfLines={TITLE_NUMBER_OF_LINES}
      description={description}
      descriptionNumberOfLines={DESCRIPTION_NUMBER_OF_LINES}
      disabled={loading}
      right={
        props.instance.type &&
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          boolean: (rProps: any) => (
            <Switch
              style={rProps['style']}
              value={value as never}
              onValueChange={onChange}
              disabled={loading}
            />
          ),
          number: undefined,
          string: undefined,
        }[props.instance.type]
      }
      onPress={
        (props.instance.type &&
          {
            boolean: onChange,
            number: undefined,
            string: undefined,
          }[props.instance.type]) ??
        (clickable ? props.instance.externalClickAction : undefined)
      }
    />
  );
});
