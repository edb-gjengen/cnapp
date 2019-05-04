import {StyleSheet, View, Platform} from "react-native";
import {SectionList} from 'react-navigation';
import {Card, ListItem, CardItem, Body, Text as Text, Left, Right, Icon, Button, Content, Spinner} from 'native-base';
import React, { Component } from 'react';
import moment from "moment";
import 'moment/locale/nb';
import theme from "../../theme";

moment.locale('nb');

export default class EventList extends Component {
    _renderItem = ({item}) => (
        <ListItem button onPress={() => { this._onPressItem(item); }} style={styles.listItem}>
            <Body style={{flex: 5}}>
                <Text style={styles.listItemTitle} numberOfLines={1}>{item.title.decoded}</Text>
                <Text style={styles.listItemTime}>{this._formatTime(item.start_time)}</Text>
            </Body>
            <Right style={{flex: 1}}>
                <Icon name="arrow-forward" />
            </Right>
        </ListItem>
    );

    _renderSectionHeader = ({section}) => {
        return (<ListItem style={styles.sectionHeader}>
            <Body>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </Body>
        </ListItem>);
    };

    _renderFooter = () => {
        if(!this.props.loading) {
            return null;
        }

        return (<View style={{paddingVertical: 20}}>
            <Spinner color="#f58220"/>
        </View>);
    };

    _onPressItem = (item) => {
        this.props.showEvent(item);
    };


    _formatTime(time) {
        return moment(time).format('llll');
    }

    render() {
        if (this.props.error) {
            return (<Content>
                <Card style={{margin: 4}}>
                    <CardItem onPress={() => { this._onPressItem(item); }}>
                        <Text style={styles.loadingText}>Kunne ikke hente programmet...</Text>
                    </CardItem>
                    <CardItem>
                        <Button onPress={this.props.handleRefresh}><Text>Prøv igjen</Text></Button>
                    </CardItem>
                </Card>
            </Content>)
        }

        return (<SectionList
            sections={this.props.eventsSectioned}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            keyExtractor={(item) => item.id}
            refreshing={this.props.refreshing}
            onRefresh={this.props.handleRefresh}
            onEndReached={this.props.handleLoadMore}
            onEndReachedThreshould={10}
            initialNumToRender={10}
            ListFooterComponent={this._renderFooter}
            style={[styles.card, styles.list]}
            ListHeaderComponent={() => { return <View style={styles.listHeader}/> }}
        />);
    }
}


const styles = StyleSheet.create({
    listItem: {
        backgroundColor: 'white',
        marginLeft: 0
    },
    listItemTitle: {
        fontSize: 14,
    },
    listItemTime: {
        fontSize: 14,
        color: '#666'
    },
    sectionHeader: {
        backgroundColor: 'white',
        marginLeft: 0,
        ...Platform.select({
            'ios': {marginBottom: -8},
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
        paddingBottom: 8
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
    }
});
