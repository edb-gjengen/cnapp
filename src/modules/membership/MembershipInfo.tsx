import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

import Button from 'src/components/Button';
import theme from 'src/theme';

interface MembershipInfoProps {
  onRegister: () => void;
  onLogin: () => void;
}
const MembershipInfo = ({ onRegister, onLogin }: MembershipInfoProps) => (
  <ScrollView style={theme.background}>
    <View style={theme.card}>
      <Text style={[theme.text, styles.headerTitle]}>Hei 👋</Text>
      <Text style={[theme.text, styles.paragraph]}>
        Her kan du bli medlem i Det Norske Studentersamfund - Chateau Neuf og ha medlemsbeviset ditt på telefonen
      </Text>
      <View style={styles.button}>
        <Button onPress={onRegister} fullWidth style={theme.button}>
          <Text style={theme.buttonText}>Bli medlem</Text>
        </Button>
      </View>
      <Text style={[theme.text, styles.header]}>Hva får jeg?</Text>
      <Text style={[theme.text, styles.paragraph, { textAlign: 'left', paddingLeft: 4 }]}>
        - Minst 25% rabatt på de fleste arrangement{'\n'}- Gratis inngang på enkelte arrangement{'\n'}- Store rabatter i
        barene{'\n'}- Egne medlemsarrangement og -tilbud{'\n'}- Mulighet til å delta i landets eldste studentdemokrati
      </Text>
      <Text style={[theme.text, styles.em]}>Allerede medlem?</Text>
      <View style={styles.button}>
        <Button onPress={onLogin} fullWidth style={theme.button}>
          <Text style={theme.buttonText}>Logg inn</Text>
        </Button>
      </View>
    </View>
  </ScrollView>
);

export default MembershipInfo;

const styles = StyleSheet.create({
  paragraph: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 10,
    lineHeight: 25,
  },
  button: {
    marginTop: 6,
    marginBottom: 16,
  },
  em: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10,
    lineHeight: 25,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 25,
    paddingLeft: 2,
  },
});
