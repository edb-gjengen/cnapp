import { StyleSheet, View, Platform, SectionList, TouchableHighlight } from 'react-native';
import { Card, Text, Icon, Button, Spinner } from 'native-base';
import React from 'react';
import moment from 'moment';
import 'moment/locale/nb';

import theme from '../../theme';

moment.locale('nb');

const _formatTime = (time) => {
  return moment(time).format('llll');
};

const EventList = ({ eventsSectioned, refreshing, handleRefresh, handleLoadMore, showEvent, error, loading }) => {
  const _renderItem = ({ item }) => (
    <TouchableHighlight
      onPress={() => {
        showEvent(item);
      }}
      style={styles.listItem}
    >
      <View>
        <View style={{ flex: 5 }}>
          <Text style={styles.listItemTitle} numberOfLines={1}>
            {item.title.decoded}
          </Text>
          <Text style={styles.listItemTime}>{_formatTime(item.start_time)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Icon name="arrow-forward" />
        </View>
      </View>
    </TouchableHighlight>
  );

  const _renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      </View>
    );
  };

  const _renderFooter = () => {
    if (!loading) {
      return null;
    }

    return (
      <View style={{ paddingVertical: 20 }}>
        <Spinner color="#f58220" />
      </View>
    );
  };

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
      renderItem={_renderItem}
      renderSectionHeader={_renderSectionHeader}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshould={10}
      initialNumToRender={10}
      ListFooterComponent={_renderFooter}
      style={[styles.card, styles.list]}
      ListHeaderComponent={() => {
        return <View style={styles.listHeader} />;
      }}
    />
  );
};
export default EventList;

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'white',
    marginLeft: 0,
  },
  listItemTitle: {
    fontSize: 14,
  },
  listItemTime: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    backgroundColor: 'white',
    marginLeft: 0,
    ...Platform.select({
      ios: { marginBottom: -8 },
    }),
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 16,
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
});
