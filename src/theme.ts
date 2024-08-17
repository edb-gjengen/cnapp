import { Platform } from 'react-native';
import { Colors } from 'react-native-ui-lib';

const colors = {
  danger: '#d9534f',
  success: '#5cb85c',
  lightText: '#666',
  neufPurple: '#720328',
  neufPink: '#CD96AB',
  neufGray: '#E5E2D7',
  neufOrange: '#f58220',
  neufBeige: '#F8BC90',
  neufBlue: '#0A0F6D',
  neufWhite: '#FFFFFF',
  neufBlack: '#161516',
  gray1: '#dddddd',
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
  padding: 16,
  backgroundColor: colors.neufGray,
};

const background = {
  backgroundColor: colors.neufGray,
};

const text = {
  color: colors.neufBlue,
};

const button = {
  backgroundColor: colors.neufBeige
}

const buttonText = {
  color: colors.neufPurple,
  fontWeight: 500,
};

export function loadTheme() {
  Colors.loadDesignTokens({ primaryColor: colors.neufBeige });
}

export default { card, colors, background, text, button, buttonText };
