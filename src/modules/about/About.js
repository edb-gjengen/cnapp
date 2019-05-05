import React, { Component } from 'react';
import { Text, View, Platform, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-navigation';

import { Button, Text as NBText, Icon } from 'native-base';
import theme from '../../theme';

const CHATEAU_NEUF_ADDRESS = 'Det Norske Studentersamfund, Slemdalsveien 15, 0369 Oslo';

export default class About extends Component {
  /* FIXME: Values here are pretty hardcoded. Should fetch config from a JSON-file or API */

  openFacebook() {
    /* Ref: https://stackoverflow.com/questions/4810803/open-facebook-page-from-android-app */
    const url = Platform.select({
      ios: 'fb://page/?id=23664032291',
      android: 'fb://page/23664032291/',
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          return Linking.openURL('https://www.facebook.com/studentersamfundet/');
        }
        return Linking.openURL(url);
      })
      .catch((err) => console.error('An error occurred', err));
  }

  openInstagram() {
    /* Ref: */
    const url = Platform.select({
      ios: 'instagram://user?username=studentersamfundet',
      android: 'http://instagram.com/_u/studentersamfundet',
    });

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          return Linking.openURL('https://www.instagram.com/studentersamfundet/');
        }
        return Linking.openURL(url);
      })
      .catch((err) => console.error('An error occurred', err));
  }

  openMap() {
    const url = Platform.select({
      ios: `comgooglemaps://?q=${CHATEAU_NEUF_ADDRESS}`,
      android: `https://www.google.com/maps/search/?api=1&query=${CHATEAU_NEUF_ADDRESS}`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${CHATEAU_NEUF_ADDRESS}`);
        }
        return Linking.openURL(url);
      })
      .catch((err) => console.error('An error occurred', err));
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.card}>
          <Text style={[styles.header, { marginTop: 8 }]}>Det Norske Studentersamfund</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.studentersamfundet.no/')}>
            <Image
              source={{ uri: 'https://galtinn.neuf.no/static/dist/images/logo.png' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.header}>Følg oss på</Text>
          <View style={[styles.section, { flex: 1, flexDirection: 'row' }]}>
            <TouchableOpacity style={styles.someBtn} onPress={this.openFacebook}>
              <Icon name="logo-facebook" style={styles.largeIcon} />
              <NBText>Facebook</NBText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.someBtn} onPress={this.openInstagram}>
              <Icon name="logo-instagram" style={styles.largeIcon} />
              <NBText>Instagram</NBText>
            </TouchableOpacity>
          </View>

          <Text style={styles.header}>Adresse</Text>
          <Text style={[styles.paragraph, { textAlign: 'center' }]}>
            Det Norske Studentersamfund{'\n'}Slemdalsveien 15, 0369 Oslo
          </Text>
          <View style={styles.section}>
            <Button iconLeft onPress={this.openMap}>
              <Icon name="map" style={styles.icon} />
              <NBText> Vis i kart</NBText>
            </Button>
          </View>
          <Text style={styles.header}>Åpningstider</Text>
          <View style={styles.section}>
            <Button iconLeft onPress={() => Linking.openURL('https://studentersamfundet.no/aapningstider/')}>
              <Icon name="time" style={styles.icon} />
              <NBText>Vis Åpningstider</NBText>
            </Button>
          </View>
          <Text style={styles.header}>Ta kontakt</Text>
          <View style={[styles.section, { flex: 1, flexDirection: 'row' }]}>
            <View>
              <Button iconLeft onPress={() => Linking.openURL('tel:+4794430002')} style={{ marginHorizontal: 10 }}>
                <Icon name="call" style={styles.icon} />
                <NBText>Ring</NBText>
              </Button>
            </View>
            <View>
              <Button
                iconLeft
                onPress={() => Linking.openURL('mailto:ledelsen@studentersamfundet.no')}
                style={{ marginHorizontal: 10 }}
              >
                <Icon name="mail" style={styles.icon} />
                <NBText>Send e-post</NBText>
              </Button>
            </View>
          </View>

          <Text style={styles.header}>Chateau Neuf</Text>
          <Image
            source={{ uri: 'https://studentersamfundet.no/wp-content/uploads/2015/04/26_KUL_Chateauneuf-1280x720.jpg' }}
            style={styles.featuredImage}
            resizeMode="contain"
          />
          <Text style={styles.paragraph}>
            Studentene i Oslo har sitt naturlige tilholdssted på Det Norske Studentersamfund, i hyggelige lokaler på
            Chateau Neuf øverst på Majorstuen. Her er det åpent alle dager unntatt søndag, og hver dag skjer det en
            rekke ting i våre mange arrangementslokaler. Enten man ønsker en tur i baren, på kafé, på debatt, på
            konsert, teater eller kino, har man muligheten på Chateau Neuf.
          </Text>
          <Text style={styles.paragraph}>
            Chateau Neuf er et frivillig drevet studenthus. Studenter over alt i Oslo kan komme hit og få nyttig og
            spennende erfaring med å drive et av Oslos største kulturhus. Her kan du stå i bar, sette lys og lyd, jobbe
            med markedsføring, produsere konserter, bli kjent med hundrevis av bra mennesker og få minner for livet.
          </Text>
          <Text style={styles.paragraph}>
            Alle studentforeninger i Oslo kan arrangere gratis på Chateau Neuf. Skal du arrangere en fest, sette en
            konsert, holde et foredrag eller gjennomføre et møte, har vi lokaler som kan brukes til dette.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#000',
    paddingBottom: 10,
    lineHeight: 25,
  },
  card: theme.card,
  featuredImage: {
    height: 230,
    width: null,
  },
  logo: {
    height: 128,
    width: null,
    marginBottom: 10,
  },
  icon: {
    fontSize: 16,
  },
  largeIcon: {
    fontSize: 40,
  },
  section: {
    marginTop: 8,
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
