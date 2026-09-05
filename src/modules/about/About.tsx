import React from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import Button from '@/components/Button';
import PrivacyButton from '@/components/PrivacyButton';
import theme from '@/theme';
import { withAppSource } from '@/utils';
import logo from '@assets/DNS-logo-svart.png';
import IconClock from '@assets/icons/clock.svg';
import IconFacebook from '@assets/icons/facebook.svg';
import IconInstagram from '@assets/icons/instagram.svg';
import IconMail from '@assets/icons/mail.svg';
import IconMap from '@assets/icons/map.svg';
import IconPhone from '@assets/icons/phone.svg';
import IconTiktok from '@assets/icons/tiktok.svg';

const CHATEAU_NEUF_ADDRESS = 'Det Norske Studentersamfund, Slemdalsveien 15, 0369 Oslo';

const openFacebook = () => {
  /* Ref: https://stackoverflow.com/questions/4810803/open-facebook-page-from-android-app */
  const url =
    Platform.select({
      ios: 'fb://page/?id=23664032291',
      android: 'fb://page/23664032291/',
    }) || '';
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        return Linking.openURL('https://www.facebook.com/studentersamfundet/');
      }
      return Linking.openURL(url);
    })
    .catch((err) => console.error('An error occurred', err));
};

const openInstagram = () => {
  const url =
    Platform.select({
      ios: 'instagram://user?username=studentersamfundet',
      android: 'https://instagram.com/_u/studentersamfundet',
    }) || '';

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        return Linking.openURL('https://www.instagram.com/studentersamfundet/');
      }
      return Linking.openURL(url);
    })
    .catch((err) => console.error('An error occurred', err));
};

const openTiktok = () => {
  const url =
    Platform.select({
      ios: 'tiktok://user?username=studentersamfund',
      android: 'https://www.tiktok.com/@studentersamfund',
    }) || '';
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        return Linking.openURL('https://www.tiktok.com/@studentersamfund');
      }
      return Linking.openURL(url);
    })
    .catch((err) => console.error('An error occurred', err));
};

const openMap = () => {
  const url =
    Platform.select({
      ios: `comgooglemaps://?q=${CHATEAU_NEUF_ADDRESS}`,
      android: `https://www.google.com/maps/search/?api=1&query=${CHATEAU_NEUF_ADDRESS}`,
    }) || '';
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${CHATEAU_NEUF_ADDRESS}`);
      }
      return Linking.openURL(url);
    })
    .catch((err) => console.error('An error occurred', err));
};

/** FIXME: Values here are pretty hardcoded. Should fetch config from a JSON-file or API */
const About = () => (
  <ScrollView style={theme.background}>
    <View style={theme.card}>
      <Text style={[theme.text, styles.header, { marginTop: 8 }]}>Det Norske Studentersamfund</Text>
      <TouchableOpacity onPress={() => Linking.openURL(withAppSource('https://neuf.no/'))}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>
      <Text style={[theme.text, styles.header]}>Følg oss på</Text>
      <View style={[styles.section, { flex: 1, flexDirection: 'row' }]}>
        <TouchableOpacity style={styles.someBtn} onPress={openFacebook}>
          <IconFacebook width={55} height={55} />
          <Text>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.someBtn} onPress={openInstagram}>
          <IconInstagram width={60} height={60} style={{ marginBottom: -6 }} />
          <Text>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.someBtn} onPress={openTiktok}>
          <IconTiktok width={50} height={50} />
          <Text>TikTok</Text>
        </TouchableOpacity>
      </View>

      <Text style={[theme.text, styles.header]}>Adresse</Text>
      <Text style={[styles.paragraph, { textAlign: 'center' }]}>
        Det Norske Studentersamfund{'\n'}Slemdalsveien 15, 0369 Oslo
      </Text>
      <View style={styles.section}>
        <Button onPress={openMap} style={theme.button}>
          <IconMap width={20} height={20} />
          <Text style={theme.buttonText}> Vis i kart</Text>
        </Button>
      </View>
      <Text style={[theme.text, styles.header]}>Åpningstider</Text>
      <View style={styles.section}>
        <Button
          onPress={() => Linking.openURL(withAppSource('https://neuf.no/praktisk#apningstider'))}
          style={theme.button}
        >
          <IconClock width={20} height={20} style={styles.icon} />
          <Text style={theme.buttonText}>Vis åpningstider</Text>
        </Button>
      </View>
      <Text style={[theme.text, styles.header]}>Ta kontakt</Text>
      <View style={[styles.section, { flex: 1, flexDirection: 'row' }]}>
        <View>
          <Button onPress={() => Linking.openURL('tel:+4794430002')} style={[theme.button, { marginHorizontal: 10 }]}>
            <IconPhone width={20} height={20} style={styles.icon} />
            <Text style={theme.buttonText}>Ring</Text>
          </Button>
        </View>
        <View>
          <Button
            onPress={() => Linking.openURL('mailto:ledelsen@studentersamfundet.no')}
            style={[theme.button, { marginHorizontal: 10 }]}
          >
            <IconMail width={20} height={20} style={styles.icon} />
            <Text style={theme.buttonText}>Send e-post</Text>
          </Button>
        </View>
      </View>

      <Text style={[theme.text, styles.header]}>Chateau Neuf</Text>
      <Image
        source={{
          uri: 'https://neuf.no/media/original_images/26_KUL_Chateauneuf.jpg',
        }}
        style={styles.featuredImage}
        resizeMode="contain"
      />
      <Text style={styles.paragraph}>
        Studentene i Oslo har sitt naturlige tilholdssted på Det Norske Studentersamfund, i hyggelige lokaler på Chateau
        Neuf øverst på Majorstuen. Her er det åpent alle dager unntatt søndag, og hver dag skjer det en rekke ting i
        våre mange arrangementslokaler. Enten man ønsker en tur i baren, på kafé, på debatt, på konsert, teater eller
        kino, har man muligheten på Chateau Neuf.
      </Text>
      <Text style={styles.paragraph}>
        Chateau Neuf er et frivillig drevet studenthus. Studenter over alt i Oslo kan komme hit og få nyttig og
        spennende erfaring med å drive et av Oslos største kulturhus. Her kan du stå i bar, sette lys og lyd, jobbe med
        markedsføring, produsere konserter, bli kjent med hundrevis av bra mennesker og få minner for livet.
      </Text>
      <Text style={styles.paragraph}>
        Alle studentforeninger i Oslo kan arrangere gratis på Chateau Neuf. Skal du arrangere en fest, sette en konsert,
        holde et foredrag eller gjennomføre et møte, har vi lokaler som kan brukes til dette.
      </Text>
      <PrivacyButton />
    </View>
  </ScrollView>
);

export default About;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: theme.colors.neufBlue,
    paddingBottom: 10,
    lineHeight: 25,
  },
  featuredImage: {
    marginTop: 10,
    marginBottom: 10,
    height: 230,
    width: null,
    display: 'flex',
  },
  logo: {
    margin: 10,
    resizeMode: 'contain',
    width: Dimensions.get('window').width * 0.8, // 80% of screen width
    alignSelf: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 4,
  },
  largeIcon: {
    fontSize: 40,
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  someBtn: {
    flex: 1,
    alignItems: 'center',
  },
});

// const HTMLStyles = StyleSheet.create({
//     p: {
//         fontSize: 16,
//         marginBottom: -30,
//         color: '#000',
//     },
//     ul: {
//         fontSize: 16,
//         color: '#000',
//         marginTop: -20,
//         marginBottom: -30,
//     },
// });
