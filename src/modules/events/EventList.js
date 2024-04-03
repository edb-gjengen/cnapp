import { StyleSheet, View, Platform, SectionList, TouchableOpacity } from 'react-native';
import { Card, Text, Spinner, ArrowForwardIcon, HStack } from 'native-base';
import { Button } from 'react-native-ui-lib';

import React from 'react';
import moment from 'moment';
import 'moment/locale/nb';

import useEventList from './useEventList';
import theme from '../../theme';

moment.locale('nb');

const _formatTime = (time) => {
  return moment(time).format('llll');
};

const renderSectionHeader = ({ section }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{section.title}</Text>
  </View>
);
const Header = () => <View style={styles.listHeader} />;

const EventList = () => {
  const { eventsSectioned, refreshing, handleRefresh, handleLoadMore, showEvent, error, loading } = useEventList();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        showEvent(item);
      }}
      style={styles.listItem}
    >
      <HStack>
        <View style={{ flex: 5 }}>
          <Text style={styles.listItemTitle} numberOfLines={1}>
            {item.title.decoded}
          </Text>
          <Text style={styles.listItemTime}>{_formatTime(item.start_time)}</Text>
        </View>
        <View style={styles.arrow}>
          <ArrowForwardIcon size={4} color={theme.colors.neufBlack} marginTop={3} />
        </View>
      </HStack>
    </TouchableOpacity>
  );

  // FIXME: Hoist component definition
  // eslint-disable-next-line react/no-unstable-nested-components
  const Footer = () =>
    !loading && (
      <View style={{ paddingVertical: 20 }}>
        <Spinner color={theme.colors.neufOrange} />
      </View>
    );

  if (error) {
    return (
      <View>
        <Card style={{ margin: 4 }}>
          <View>
            <Text style={styles.loadingText}>Kunne ikke hente programmet...</Text>
          </View>
          <View>
            <Button onPress={handleRefresh}>
              <Text>Prøv igjen</Text>
            </Button>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <SectionList
      sections={eventsSectioned}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshould={10}
      initialNumToRender={10}
      ListFooterComponent={Footer}
      style={[styles.card, styles.list]}
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
  card: theme.card,
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
});
