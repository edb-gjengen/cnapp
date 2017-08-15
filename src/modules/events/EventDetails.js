import React, { Component } from 'react';
import {Linking, StyleSheet, ScrollView, Text, Platform, View, Image, TouchableHighlight} from "react-native";
import HTMLView from 'react-native-htmlview';
import moment from "moment";
import {Button, Icon, Text as NBText} from "native-base";

moment.locale('nb');

export default class EventDetails extends Component {

    _formatTime(time) {
        return moment(time).format('HH:mm');
    }

    _formatMonth(time) {
        return moment(time).format('MMM');
    }

    _formatDay(time) {
        return moment(time).format('DD.');
    }
    _formatLocalDay(time) {
        return moment(time).format('ddd')
    }

    _formatYear(time) {
        return moment(time).format('YYYY');
    }

    _formatRelative(time) {
        return moment(time).fromNow();
    }

    _onUrlPress(link) {
        Linking.openURL(link);
    }

    price() {
        let item = this.props.item;
        let reg_kr = null;
        let mem_kr = null;
        if (item.price_regular === '0') {
            item.price_regular = 'Gratis'
        }
        if (item.price_member === '0') {
            item.price_member = 'Gratis'
        }
        if (item.price_regular != 'Gratis') {
            reg_kr = " kr"
        }
        if (item.price_member != 'Gratis') {
            mem_kr = " kr"
        }
        if (item.price_regular && item.price_member) {
            return <Text style={styles.metaText}>Pris: {item.price_regular}{reg_kr} - Medlemmer: {item.price_member}{mem_kr}</Text>;
        }
        if (item.price_regular) {
            return <Text style={styles.metaText}>Pris: {item.price_regular}{reg_kr}</Text>
        }
        if (item.price_member) {
            return <Text style={styles.metaText}>Pris (Medlemmer): {item.price_member}{mem_kr}</Text>
        }
    }

    render() {
        const item = this.props.item;
        let image = null;
        if (item.thumbnail.medium_large) {
            image = <Image source={{uri: item.thumbnail.medium_large}} style={styles.image} />;
        }

        let faceButton = null;
        if (item.facebook_url) {
            faceButton = <TouchableHighlight underlayColor="#fff" onPress={() => this._onUrlPress(item.facebook_url)}>
                            <View>
                                <Text style={styles.faceText}><Icon style={styles.faceIcon} name="logo-facebook" /> På Facebook</Text>
                            </View>
                         </TouchableHighlight>;
        }
        let ticket = null;
        if (item.ticket_url) {
            ticket = <View style={styles.ticketButton}>
                        <Button onPress={() => this._onUrlPress(item.ticket_url)} full><NBText>Kjøp billett</NBText></Button>
                    </View>;
        }

        let year = null;
        if(moment().year() !== moment(item.start_time).year()) {
            year = <Text style={styles.year}>{this._formatYear(item.start_time)}</Text>
        }

        return (
            <ScrollView>
                {image}
                <View style={styles.card}>
                    <Text style={styles.header} numberOfLines={2}>{item.title.decoded}</Text>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={styles.dateContainer}>
                            <View style={styles.dateCard}>
                                <Text style={styles.day}>{this._formatDay(item.start_time)}</Text>
                                <Text style={styles.month}>{this._formatMonth(item.start_time)}</Text>
                                {year}
                            </View>
                        </View>
                        <View style={styles.metaContainer}>
                            <View style={styles.metaInner}>
                                <View style={[styles.metaIcon, {paddingLeft: 1}]}><Icon name="pin" style={styles.icons} /></View>
                                <Text style={styles.metaText}>{item.venue}</Text>
                            </View>
                            <View style={styles.metaInner}>
                                <View style={styles.metaIcon}><Icon name="time" style={styles.icons} /></View>
                                <Text style={styles.metaText}>{this._formatLocalDay(item.start_time)} kl. {this._formatTime(item.start_time)} - {this._formatTime(item.end_time)},</Text>
                                <Text style={styles.timeRelative}> {this._formatRelative(item.start_time)}</Text>
                            </View>
                            {this.price()}
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
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
        width: null
    },
    time: {
        fontSize: 14,
        color: '#666'
    },
    metaIcon: {
        width: 16,
        paddingTop: 3,
    },
    metaContainer: {
        flex: 3,
        paddingLeft: 10,
    },
    metaInner: {
        flexDirection: 'row'
    },
    metaText: {
        color: '#000',
    },
    timeRelative: {
        color: '#666',
    },
    content: {
        borderTopWidth: 0.5,
        borderColor: '#999',
        marginTop: 16,
        paddingTop: 10,
    },
    dateContainer: {
        width: 62,
        justifyContent: 'center',
    },
    dateCard: {
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
                elevation: 1,
            },
        }),
        backgroundColor: '#fff',
        paddingBottom: 6,
    },
    day: {
        paddingTop: 5,
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },
    month: {
        textAlign: 'center',
        paddingHorizontal: 16,
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
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    faceText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
    },
    faceIcon: {
        fontSize: 25,
        color: '#3B5998',
        alignSelf: 'center',
    },
    ticketButton: {
        paddingTop: 20,
    },
    icons: {
        fontSize: 14,
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