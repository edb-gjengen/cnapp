import { SimpleLineIcons as Icon } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View, Platform, FlatList, TouchableOpacity, Text, Linking } from 'react-native';
import 'moment/locale/nb';

import Button from '@/components/Button';
import theme from '@/theme';
import { EventType } from '@/types/data';

import useEventList from './useEventList';

moment.locale('nb');

const formatTime = (time: string) => {
  return moment(time).format('llll');
};

const Header = () => <View style={styles.listHeader} />;

const EventList = () => {
  const { events, refreshing, handleRefresh, error } = useEventList();

  const renderItem = ({ item, index }: { item: EventType; index: number }) => (
    <TouchableOpacity
      onPress={() => {
        return Linking.openURL(item.url);
      }}
      style={[styles.listItem, ...(index === events.length - 1 ? [styles.lastListItem] : [])]}
    >
      <View style={styles.row}>
        <View style={{ flex: 5 }}>
          <Text style={styles.listItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.listItemSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
          <Text style={styles.listItemTime}>
            {item.futureOccurrencesCount > 1 && 'Neste: '}
            {formatTime(item.nextOccurrence.start)}
            {item.nextOccurrence.venue &&
              ` ${item.nextOccurrence.venue.preposition} ${item.nextOccurrence.venue.title}`}
          </Text>
          {item.futureOccurrencesCount > 1 && (
            <Text style={styles.listItemTime}>{`Se flere tider (${item.futureOccurrencesCount - 1})`}</Text>
          )}
        </View>
        <View style={styles.arrow}>
          <Icon name="arrow-right" style={{ color: theme.colors.neufBlack, marginTop: 3 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={theme.card}>
        <View>
          <Text style={styles.loadingText}>Kunne ikke hente programmet...</Text>
        </View>
        <View>
          <Button onPress={handleRefresh}>
            <Text>Prøv igjen</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item: EventType) => item.id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      style={[theme.card, styles.list]}
      ListHeaderComponent={Header}
    />
  );
};
export default EventList;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: theme.colors.betongGray,
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neufPink,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemSubtitle: {
    fontSize: 16,
  },
  listItemTime: {
    fontSize: 14,
    color: theme.colors.lightText,
  },
  sectionHeader: {
    backgroundColor: theme.colors.neufWhite,
    ...Platform.select({
      ios: { marginBottom: -8 },
    }),
    paddingLeft: 8,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    paddingBottom: 8,
  },
  list: {
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  listHeader: {
    paddingTop: 8,
    backgroundColor: theme.colors.neufGray,
  },
  arrow: {
    flex: 1,
    alignItems: 'flex-end',
  },
  row: { flex: 1, flexDirection: 'row' },
});
