import { FlashListProps } from '@shopify/flash-list';

export type OverrideItemLayout = Exclude<
  FlashListProps<unknown>['overrideItemLayout'],
  undefined
>;
