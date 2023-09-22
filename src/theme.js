import { Platform } from 'react-native';
import { Colors } from 'react-native-ui-lib';

const colors = {
  primary: '#f58220',
  danger: '#d9534f',
};

const card = {
  ...Platform.select({
    ios: {
      shadowColor: 'rgba(0,0,0, .2)',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 1,
      shadowRadius: 1,
    },
    android: {
      elevation: 1,
    },
  }),
  padding: 8,
  margin: 8,
  backgroundColor: '#fff',
};

export function loadTheme() {
  Colors.loadDesignTokens({ primaryColor: colors.primary });
}

export default { card, colors };
