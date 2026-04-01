import React, { useMemo } from 'react';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IProps {
  focused: boolean;
  color: string;
  children: string;
}

export function TabBarLabel(props: IProps) {
  const data = useMemo(() => {
    if (props.children.indexOf('}') === -1) {
      return { label: props.children };
    }

    const split = props.children.split('}');
    return {
      icon: split[0].slice(1),
      label: '  ' + split[1],
    };
  }, [props]);

  return (
    <Text
      style={{
        color: props.color,
      }}
    >
      {data.icon && (
        <MaterialCommunityIcons name={data.icon as never} size={16} />
      )}
      {data.label}
    </Text>
  );
}
