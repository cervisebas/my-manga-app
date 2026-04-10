import { StyleSheet, View } from 'react-native';
import { UText } from './UniwindElements';
import { useTheme } from 'react-native-paper';

export function ChipNewChapter() {
  const theme = useTheme();

  return (
    <View
      className={'rounded-xl bg-transparent border py-0.5 px-2'}
      style={{ borderColor: theme.colors.primary }}
    >
      <UText
        className={'font-medium'}
        style={[styles.text, { color: theme.colors.primary }]}
      >
        ¡Nuevo!
      </UText>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 8,
  },
});
