import { useCallback, useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface Handler {
  window: ScaledSize;
  screen: ScaledSize;
}

type HandlerType = 'window' | 'screen';

export function useDimension(
  use_type: HandlerType = 'window',
): [number, number] {
  const [dimension, setDimension] = useState<ScaledSize>(
    Dimensions.get(use_type),
  );

  const _onChange = useCallback(
    (types: Handler) => setDimension(types[use_type]),
    [use_type],
  );

  useEffect(() => {
    const event = Dimensions.addEventListener('change', _onChange);
    return event.remove;
  }, []);

  return [dimension.width, dimension.height];
}
