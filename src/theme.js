import { Platform } from 'react-native';

const colors = {
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
export default { card, colors };
