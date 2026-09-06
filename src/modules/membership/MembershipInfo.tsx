import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

import BulletList from '@/components/BulletList';
import Button from '@/components/Button';
import PrivacyButton from '@/components/PrivacyButton';
import theme from '@/theme';

const BENEFITS = [
  'Rabatter på utvalgte arrangementer',
  'Tidlig innslipp under utvalgte arrangementer',
  'Earlybird-billetter til utvalgte arrangementer',
  'Medlemspriser hos Studentersamfundet i Trondhjem og Studentersamfunnet i Bergen',
  'Stemmerett i alle saker på medlemsmøter',
  'Mulighet til å stille til verv i styret og som direktør',
];

interface MembershipInfoProps {
  onRegister: () => void;
  onLogin: () => void;
}
const MembershipInfo = ({ onRegister, onLogin }: MembershipInfoProps) => (
  <ScrollView>
    <View style={theme.card}>
      <Text style={[theme.text, styles.headerTitle]}>Hei 👋</Text>
      <Text style={[theme.text, styles.paragraph]}>
        Her kan du bli medlem i Det Norske Studentersamfund. Appen fungerer som medlemsbevis.
      </Text>
      <View style={styles.button}>
        <Button variant="primary" onPress={onRegister} fullWidth>
          Bli medlem
        </Button>
      </View>
      <Text style={[theme.text, styles.header]}>Medlemsfordeler</Text>
      <Text style={[theme.text, styles.intro]}>Som medlem i Det Norske Studentersamfund får man:</Text>
      <BulletList items={BENEFITS} />
      <Text style={[theme.text, styles.em]}>Allerede medlem?</Text>
      <View style={styles.button}>
        <Button onPress={onLogin} fullWidth>
          Logg inn
        </Button>
      </View>
    </View>
    <PrivacyButton />
  </ScrollView>
);

export default MembershipInfo;

const styles = StyleSheet.create({
  paragraph: {
    ...theme.typography.body,
    textAlign: 'center',
    paddingBottom: 10,
  },
  intro: {
    ...theme.typography.body,
    marginBottom: 12,
  },
  button: {
    marginTop: 6,
    marginBottom: 16,
  },
  em: {
    ...theme.typography.body,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    ...theme.typography.h2,
    textAlign: 'center',
    paddingVertical: 10,
  },
  header: {
    ...theme.typography.h3,
    marginBottom: 4,
  },
});
