import { TZDate } from '@date-fns/tz';
import Icon from '@react-native-vector-icons/feather/static';
import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Linking } from 'react-native';

import Button from '@/components/Button';
import theme from '@/theme';
import { EventType } from '@/types/data';
import { withAppSource } from '@/utils';

import useEventList from './useEventList';

// Venue-local (Europe/Oslo) wall-clock time regardless of device timezone,
// e.g. "lø. 1. aug. 2026 kl. 19:00"
const formatTime = (time: string) => {
  return format(new TZDate(parseISO(time), 'Europe/Oslo'), "EEEE d. MMM y 'kl.' HH:mm", { locale: nb });
};

const Header = () => <View style={styles.listHeader} />;

const EventList = () => {
  const { events, refreshing, handleRefresh, error } = useEventList();

  const renderItem = ({ item, index }: { item: EventType; index: number }) => (
    <TouchableOpacity
      onPress={() => {
        return Linking.openURL(withAppSource(item.url));
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
          <Icon name="arrow-right" size={20} style={{ color: theme.colors.black }} />
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
          <Button onPress={handleRefresh}>Prøv igjen</Button>
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
      ListHeaderComponent={Header}
    />
  );
};
export default EventList;

const styles = StyleSheet.create({
  listItem: {
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
    ...theme.text,
    ...theme.typography.body,
    fontWeight: '600',
  },
  listItemSubtitle: {
    ...theme.text,
    ...theme.typography.body,
  },
  listItemTime: {
    ...theme.text,
    ...theme.typography.caption,
  },
  loadingText: {
    ...theme.text,
    ...theme.typography.body,
    textAlign: 'center',
    paddingBottom: 8,
  },
  listHeader: {
    paddingTop: 8,
  },
  arrow: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  row: { flex: 1, flexDirection: 'row' },
});
