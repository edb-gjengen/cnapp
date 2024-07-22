import { SimpleLineIcons as Icon } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import { StyleSheet, View, Platform, SectionList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Button } from 'react-native-ui-lib';
import 'moment/locale/nb';

import theme from 'src/theme';
import { EventType } from 'src/types/data';

import useEventList from './useEventList';

moment.locale('nb');

const formatTime = (time: string) => {
  return moment(time).format('llll');
};

const renderSectionHeader = ({ section }: { section: { title: string } }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{section.title}</Text>
  </View>
);
const Header = () => <View style={styles.listHeader} />;

const EventList = () => {
  const { eventsSectioned, refreshing, handleRefresh, handleLoadMore, showEvent, error, loading } = useEventList();

  const renderItem = ({ item }: { item: EventType }) => (
    <TouchableOpacity
      onPress={() => {
        showEvent(item);
      }}
      style={styles.listItem}
    >
      <View style={styles.row}>
        <View style={{ flex: 5 }}>
          <Text style={styles.listItemTitle} numberOfLines={1}>
            {item.title.decoded}
          </Text>
          <Text style={styles.listItemTime}>{formatTime(item.start_time)}</Text>
        </View>
        <View style={styles.arrow}>
          <Icon name="arrow-right" style={{ color: theme.colors.neufBlack, marginTop: 3 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  // FIXME: Hoist component definition
  // eslint-disable-next-line react/no-unstable-nested-components
  const Footer = () =>
    !loading && (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator color={theme.colors.neufOrange} />
      </View>
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
    <SectionList
      sections={eventsSectioned}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item: EventType) => item.id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={10}
      initialNumToRender={10}
      ListFooterComponent={Footer}
      style={[theme.card, styles.list]}
      ListHeaderComponent={Header}
    />
  );
};
export default EventList;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: theme.colors.neufWhite,
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neufGray,
  },
  listItemTitle: {
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
  },
  arrow: {
    flex: 1,
    alignItems: 'flex-end',
  },
  row: { flex: 1, flexDirection: 'row' },
});
