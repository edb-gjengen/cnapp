import {Platform, StyleSheet, FlatList, Text, View, Linking, TouchableOpacity, ActivityIndicator} from "react-native";
import React, { Component } from 'react';
import moment from "moment";
import 'moment/locale/nb';

export default class EventList extends Component {
    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <View>
            <TouchableOpacity onPress={() => { this._onPressItem(item); }} style={[styles.listItem, styles.card]}>
                <View>
                    <Text style={styles.listItemTitle}>{item.title.rendered}</Text>
                    <Text style={styles.listItemTime}>{this._formatTime(item.start_time)}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    _onPressItem = (item) => {
        Linking.openURL(item.link);
    };

    _formatTime(time) {
        moment.locale('nb');
        return moment(time).format('llll');
    }

    render() {
        if(this.props.loading) {
            return (<View style={styles.card}><Text style={styles.loadingText}>Loading...</Text><ActivityIndicator/></View>)
        }
        return (<FlatList
            data={this.props.events}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            style={styles.container}
            refreshing={this.props.refreshing}
        />);
    }
}


const styles = StyleSheet.create({
    listItem: {
        height: 86,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    listItemTime: {
        fontSize: 16,
        color: 'black'
    },
    container: {
        flex: 1,
    },
    card: {
        borderColor: '#e1e8ee',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            android: {
                elevation: 1,
            },
        }),
        padding: 8,
        margin: 8,
        backgroundColor: '#fff',
    },
    loadingText: {
        textAlign: 'center',
        paddingBottom: 8
    }
});