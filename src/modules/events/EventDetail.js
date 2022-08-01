import React from 'react';
import { Linking, StyleSheet, ScrollView, Text, Platform, View, Image, TouchableOpacity } from 'react-native';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';
import { Icon } from 'native-base';

import theme from '../../theme';

moment.locale('nb');

const CHATEAU_NEUF_ADDRESS = 'Chateau Neuf, Slemdalsveien 15, 0369 Oslo';

const FORMAT_TIME = 'HH:mm';
const FORMAT_MONTH = 'MMM';
const FORMAT_DAY = 'DD.';
const FORMAT_LOCAL_DAY = 'ddd';
const FORMAT_YEAR = 'YYYY';

const formatRelative = (time) => moment(time).fromNow();

const format = (time, formatString = FORMAT_TIME) => moment(time).format(formatString);

const formatTicketText = (event) => {
  /* FIXME: This should be handled by API */
  let regularPrice = '';
  let memberPrice = '';
  if (event.price_regular === '0') {
    event.price_regular = 'Gratis';
  }
  if (event.price_member === '0') {
    event.price_member = 'Gratis';
  }
  if (event.price_regular !== 'Gratis') {
    regularPrice = ' kr';
  }
  if (event.price_member !== 'Gratis') {
    memberPrice = ' kr';
  }

  let text = '';
  if (event.price_regular && event.price_member) {
    text = `Pris: ${event.price_regular}${regularPrice} / Medlemmer: ${event.price_member}${memberPrice}`;
  } else if (event.price_regular) {
    text = `Pris: ${event.price_regular}${regularPrice}`;
  } else if (event.price_member) {
    text = `Pris (Medlemmer): ${event.price_member}${memberPrice}`;
  } else {
    return '';
  }
  return text;
};

const onFacebookUrlPress = (link) => {
  const fbEventPattern = /https?:\/\/www\.facebook\.com\/events\/(\d+)\/?/i;
  const matches = fbEventPattern.exec(link);
  let iosURL = link;
  if (matches && matches.length) {
    iosURL = `fb://event/?id=${matches[1]}`;
  }
  const url = Platform.select({
    ios: iosURL,
    android: link,
  });
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        return Linking.openURL(link);
      }
      return Linking.openURL(url);
    })
    .catch((err) => console.error('An error occurred', err));
};

const onLocationPress = (venue) => {
  if (venue !== 'Annetsteds') {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${CHATEAU_NEUF_ADDRESS}`);
  }
};

const VenueLocation = ({ venue }) => (venue !== 'Annetsteds' ? CHATEAU_NEUF_ADDRESS : 'Ukjent adresse');

const PriceAndTicket = ({ event }) => {
  const text = formatTicketText(event);

  if (text === '') {
    return null;
  }

  if (event.ticket_url) {
    return (
      <TouchableOpacity style={styles.metaInner} onPress={() => Linking.openURL(event.ticket_url)}>
        <View style={styles.metaIcon}>
          <Icon name="card" style={styles.icons} />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.metaText}>{text}</Text>
          <Text style={styles.metaSubtitle}>Kjøp billett</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.metaInner}>
      <View style={styles.metaIcon}>
        <Icon name="card" style={styles.icons} />
      </View>
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.metaText}>{text}</Text>
        <Text style={styles.metaSubtitle}>Billett i døra</Text>
      </View>
    </View>
  );
};

const FaceButton = ({ event }) => {
  if (!event.facebook_url) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => onFacebookUrlPress(event.facebook_url)} style={styles.metaInner}>
      <View style={[styles.metaIcon, { marginTop: 0 }]}>
        <Icon name="logo-facebook" style={styles.icons} />
      </View>
      <View>
        <Text style={[styles.metaText, { paddingTop: 2 }]}>På Facebook</Text>
      </View>
    </TouchableOpacity>
  );
};

const Year = ({ startTime }) => {
  if (moment().year() === moment(startTime).year()) {
    return null;
  }
  return <Text style={styles.year}>{format(startTime, FORMAT_YEAR)}</Text>;
};

const formatTimeFull = (event) => {
  const endTime = event.end_time ? ` - ${format(event.end_time, FORMAT_TIME)}` : '';
  const startTime = `${format(event.start_time, FORMAT_LOCAL_DAY)} kl. ${format(event.start_time, FORMAT_TIME)}`;
  return `${startTime}${endTime}`;
};

const EventDetail = ({
  route: {
    params: { event },
  },
}) => (
  <ScrollView>
    {event.thumbnail.medium_large && <Image source={{ uri: event.thumbnail.medium_large }} style={styles.image} />}
    <View style={styles.card}>
      {/* Date and title */}
      <View style={styles.dateAndTitle}>
        <View style={styles.dateContainer}>
          <View style={[styles.card, styles.dateCard]}>
            <Text style={styles.day}>{format(event.start_time, FORMAT_DAY)}</Text>
            <Text style={styles.month}>{format(event.start_time, FORMAT_MONTH)}</Text>
            <Year startTime={event.start_time} />
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title.decoded}
          </Text>
        </View>
      </View>
      {/* Time and calendar */}
      <TouchableOpacity style={styles.metaInner}>
        <View style={styles.metaIcon}>
          <Icon name="time" style={styles.icons} />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.metaText}>{formatTimeFull(event)}</Text>
          <Text style={styles.metaSubtitle}>{formatRelative(event.start_time)}</Text>
        </View>
      </TouchableOpacity>
      {/* Location and maps */}
      <TouchableOpacity style={styles.metaInner} onPress={() => onLocationPress(event.venue)}>
        <View style={[styles.metaIcon, { paddingLeft: 1 }]}>
          <Icon name="pin" style={styles.icons} />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.metaText}>{event.venue}</Text>
          <Text style={styles.metaSubtitle} numberOfLines={1}>
            <VenueLocation venue={event.venue} />
          </Text>
        </View>
      </TouchableOpacity>
      <PriceAndTicket event={event} />
      <FaceButton event={event} />
      <HTMLView style={styles.content} stylesheet={HTMLStyles} value={event.content.rendered} />
    </View>
  </ScrollView>
);

export default EventDetail;

const styles = StyleSheet.create({
  dateAndTitle: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  titleContainer: {
    paddingLeft: 10,
    justifyContent: 'center',
    flex: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  card: theme.card,
  image: {
    height: 260,
    width: null,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  metaInner: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  metaIcon: {
    width: 16,
    paddingTop: 3,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  metaText: {
    color: '#000',
  },
  metaSubtitle: {
    color: '#666',
  },
  content: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    marginTop: 8,
    paddingTop: 10,
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateCard: {
    margin: 0,
    padding: 0,
    paddingBottom: 6,
    width: 62,
  },
  day: {
    paddingTop: 5,
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  month: {
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  year: {
    fontSize: 9,
    color: '#fff',
    backgroundColor: '#f58220',
    textAlign: 'center',
    paddingRight: 20,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingTop: 3,
  },
  icons: {
    fontSize: 16,
  },
});

// FIXME: Ninja margin
const HTMLStyles = StyleSheet.create({
  p: {
    fontSize: 16,
    marginBottom: -30,
    color: '#000',
  },
  ul: {
    fontSize: 16,
    color: '#000',
    marginTop: -20,
    marginBottom: -30,
  },
});
