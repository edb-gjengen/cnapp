import {StyleSheet, View, SectionList} from "react-native";
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
        return (<ListItem style={[styles.listItem, {paddingBottom: 0, borderBottomWidth: 0}]}>
            <Body>
                <Text style={styles.listItemSectionTitle}>{section.title}</Text>
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
            style={[styles.list, {paddingRight: 0}]}
        />);
    }
}


const styles = StyleSheet.create({
    listItem: {
        marginLeft: 0
    },
    listItemTitle: {
        fontSize: 14,
    },
    listItemTime: {
        fontSize: 14,
        color: '#666'
    },
    listItemSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        paddingBottom: 8
    },
    list: theme.card,
});