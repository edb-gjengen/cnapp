import React, { Component } from 'react';
import {StyleSheet, ScrollView, Text, Platform, View, Image} from "react-native";
import HTMLView from 'react-native-htmlview';
import moment from "moment";

export default class EventDetails extends Component {

    _formatTime(time) {
        moment.locale('nb');
        return moment(time).format('llll');
    }

    render() {
        const item = this.props.item;
        return (
             <ScrollView>
                 <Image source={{uri: item.thumbnail.medium_large}} style={styles.image} resizeMode="cover" />
                 <View style={styles.card}>
                     <Text style={styles.header}>{item.title.decoded}</Text>
                     <Text style={styles.time}>{this._formatTime(item.start_time)}</Text>
                     <HTMLView style={styles.content} stylesheet={HTMLStyles} value={item.content.rendered}/>
                 </View>
             </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    paragraph: {
        fontSize: 16,
        color: '#000',
        paddingBottom: 10,
        lineHeight: 25,
    },
    card: {
        borderColor: '#e1e8ee',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: {height: 0, width: 0},
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
    image: {
        height: 260,
    },
    time: {
        fontSize: 14,
        color: '#666'
    },
    content: {
        paddingTop: 10,
    }
});

//FIXME: Ninja margin
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