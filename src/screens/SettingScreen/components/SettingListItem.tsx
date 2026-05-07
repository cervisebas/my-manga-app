import { ItemWithIcon } from '@/common/components/ItemWithIcon';
import { SettingItem } from '@/settings/interfaces/SettingItem';
import { Switch } from 'react-native-paper';

interface IProps {
  icon: string;
  type: SettingItem['type'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  title: string;
  titleNumberOfLines?: number;
  description: string | undefined;
  descriptionNumberOfLines?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?(val: any): void;
}

export function SettingListItem(props: IProps) {
  const onChange = () => {
    switch (props.type) {
      case 'boolean':
        props.onChange?.(!props.value);
        break;

      default:
        console.warn('No implementado');
        break;
    }
  };

  if (props.type === 'boolean') {
    return (
      <ItemWithIcon
        leftIcon={props.icon}
        title={props.title}
        titleNumberOfLines={props.titleNumberOfLines}
        description={props.description}
        descriptionNumberOfLines={props.descriptionNumberOfLines}
        right={(rProps) => (
          <Switch
            style={rProps.style}
            value={props.value}
            onValueChange={onChange}
          />
        )}
        onPress={onChange}
      />
    );
  }

  return <></>;
}
