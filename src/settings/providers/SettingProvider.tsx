import React, { createContext, useEffect, useState } from 'react';
import { SettingManager } from '../classes/SettingManager';
import { SettingItem } from '../classes/SettingItem';

interface SettingProviderProps {
  children: React.ReactNode;
}

export const SettingContext = createContext({
  options: [] as SettingItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOption: (_key: SettingItem['key'], _val: SettingItem['value']) => {},
});

export function SettingProvider(props: SettingProviderProps) {
  const [options, setOptions] = useState<SettingItem[]>([]);

  function loadOptions() {
    setOptions(SettingManager.getList());
  }

  function setOption(key: SettingItem['key'], val: SettingItem['value']) {
    if (key !== undefined) {
      SettingManager.setOption(key, val);
    }
    loadOptions();
  }

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <SettingContext.Provider value={{ options, setOption }}>
      {props.children}
    </SettingContext.Provider>
  );
}
