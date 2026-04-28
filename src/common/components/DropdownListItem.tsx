import React, { useMemo, useRef } from 'react';
import { Dropdown, DropdownProps, DropdownRef } from './Dropdown';
import { ItemWithIcon, ItemWithIconProps } from './ItemWithIcon';

type IProps = Pick<DropdownProps, 'options' | 'value' | 'onChange'> &
  Exclude<ItemWithIconProps, 'onPress'>;

export function DropdownListItem(props: IProps) {
  const refDropdown = useRef<DropdownRef>(null);
  const options = useMemo(
    () => [
      {
        label: 'No seleccionado',
        value: undefined,
      },
      ...props.options,
    ],
    [props.options],
  );

  const selected = options.find((option) => option.value === props.value);

  return (
    <React.Fragment>
      <ItemWithIcon
        {...props}
        description={selected?.label ?? '- Sin seleccionar -'}
        rightIcon={'menu-down'}
        onPress={() => refDropdown.current?.open()}
      />
      <Dropdown
        ref={refDropdown}
        value={props.value}
        options={options as never}
        onChange={props.onChange}
      />
    </React.Fragment>
  );
}
