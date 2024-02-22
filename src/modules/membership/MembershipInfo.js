import React from 'react';

import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';
import theme from '../../theme';

const MembershipInfo = ({ onRegister, onLogin }) => (
  <ScrollView>
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Hei 👋</Text>
      <Text style={styles.paragraph}>
        Her kan du bli medlem i Det Norske Studentersamfund - Chateau Neuf og ha medlemsbeviset ditt på telefonen
      </Text>
      <View style={styles.button}>
        <Button onPress={onRegister} fullWidth>
          <Text>Bli medlem</Text>
        </Button>
      </View>
      <Text style={styles.header}>Hva får jeg?</Text>
      <Text style={[styles.paragraph, { textAlign: 'left', paddingLeft: 4 }]}>
        - Minst 25% rabatt på de fleste arrangement{'\n'}- Gratis inngang på enkelte arrangement{'\n'}- Store rabatter i
        barene{'\n'}- Egne medlemsarrangement og -tilbud{'\n'}- Mulighet til å delta i landets eldste studentdemokrati
      </Text>
      <Text style={styles.em}>Allerede medlem?</Text>
      <View style={styles.button}>
        <Button onPress={onLogin} fullWidth>
          <Text>Logg inn</Text>
        </Button>
      </View>
    </View>
  </ScrollView>
);

export default MembershipInfo;

const styles = StyleSheet.create({
  card: theme.card,
  paragraph: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    paddingBottom: 10,
    lineHeight: 25,
  },
  button: {
    marginTop: 6,
    marginBottom: 16,
  },
  em: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
    paddingVertical: 10,
    lineHeight: 25,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 25,
    paddingLeft: 2,
  },
});
