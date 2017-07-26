import React, { Component } from 'react';
import {Linking, StyleSheet, ScrollView, Text, Platform, View, Image, TouchableHighlight, Button} from "react-native";
import HTMLView from 'react-native-htmlview';
import moment from "moment";

export default class EventDetails extends Component {

    _formatTime(time) {
        moment.locale('nb');
        return moment(time).format('HH:mm');
    }

    _formatMonth(time) {
        moment.locale('nb');
        return moment(time).format('MMM');
    }

    _formatDay(time) {
        moment.locale('nb');
        return moment(time).format('DD');
    }

    _formatYear(time) {
        moment.locale('nb');
        return moment(time).format('YYYY');
    }

    _onUrlPress(link) {
        Linking.openURL(link);
    }

    render() {
        const item = this.props.item;
        let image = null;
        if (item.thumbnail.medium_large) {
            image = <Image source={{uri: item.thumbnail.medium_large}} style={styles.image} resizeMode="cover" />;
        }
        let price = null;
        if (item.price_regular && item.price_regular) {
            price = <Text style={styles.info}>Pris: {item.price_regular} - Medlemer: {item.price_member}</Text>;
        }
        let faceButton = null;
        if (item.facebook_url) {
            faceButton = <TouchableHighlight style={styles.faceButton} underlayColor="#fff"
                                            onPress={() => this._onUrlPress(item.facebook_url)}>
                            <Image style={styles.faceIcon} resizeMode="contain"
                                   source={require('./img/facebook_circle_color-256.png')} />
                         </TouchableHighlight>;
        }
        let ticket = null;
        if (item.ticket_url) {
            ticket = <View style={styles.ticketButton}>
                        <Button onPress={() => this._onUrlPress(item.ticket_url)}
                                title="Kjøp bilett"/>
                    </View>;
        }
        return (
            <ScrollView>
                {image}
                <View style={styles.card}>
                    <Text style={styles.header} numberOfLines={2}>{item.title.decoded}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.date}>
                            <Text style={styles.day}>{this._formatDay(item.start_time)}</Text>
                            <Text style={styles.month}>{this._formatMonth(item.start_time)}</Text>
                            <Text style={styles.year}>{this._formatYear(item.start_time)}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.info}>{item.venue}</Text>
                            <Text style={styles.info}>kl. {this._formatTime(item.start_time)}</Text>
                            {price}
                        </View>
                        {faceButton}
                    </View>
                    {ticket}
                    <HTMLView style={styles.content} stylesheet={HTMLStyles} value={item.content.rendered}/>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
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
    info: {
        color: '#000',
    },
    content: {
        paddingTop: 20,
    },
    date: {
        borderColor: '#e1e8ee',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: {height: 0, width: 0},
                shadowOpacity: 2,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
        marginTop: 10,
        backgroundColor: '#eee',
    },
    day: {
        paddingTop: 5,
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },
    month: {
        textAlign: 'center',
        paddingBottom: 5,
    },
    year: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: '#f58220',
        textAlign: 'center',
        paddingRight: 20,
        paddingBottom: 3,
        paddingLeft: 20,
        paddingTop: 3,
    },
    infoContainer: {
        flex: 3,
        marginLeft: 20,
        marginTop: 20,
    },
    faceButton: {
        marginTop: 10,
        flex: 1,
    },
    faceIcon: {
        height: 70,
        width: 70,
        alignSelf: 'flex-end',
    },
    ticketButton: {
        paddingTop: 20,
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