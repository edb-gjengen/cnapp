import React, { Component } from 'react';
import {Linking, StyleSheet, ScrollView, Text, Platform, View, Image, TouchableHighlight,
        TouchableOpacity} from "react-native";
import HTMLView from 'react-native-htmlview';
import moment from "moment";
import {Button, Icon, Text as NBText} from "native-base";

moment.locale('nb');

const CHATEAU_NEUF_ADDRESS = 'Chateau Neuf, Slemdalsveien 15, 0369 Oslo';

export default class EventDetail extends Component {

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
    _formatLocation() {
        if(this.props.item.venue !== 'Annetsteds') {
            return CHATEAU_NEUF_ADDRESS;
        }
        return 'Ukjent adresse'
    }

    _formatTicketText() {
        /* FIXME: This should be handled by API */
        const {item} = this.props;
        let reg_kr = '';
        let mem_kr = '';
        if (item.price_regular === '0') {
            item.price_regular = 'Gratis'
        }
        if (item.price_member === '0') {
            item.price_member = 'Gratis'
        }
        if (item.price_regular !== 'Gratis') {
            reg_kr = " kr"
        }
        if (item.price_member !== 'Gratis') {
            mem_kr = " kr"
        }

        let text = '';
        if (item.price_regular && item.price_member) {
            text = `Pris: ${item.price_regular}${reg_kr} / Medlemmer: ${item.price_member}${mem_kr}`;
        }
        else if (item.price_regular) {
            text = `Pris: ${item.price_regular}${reg_kr}`;
        }
        else if (item.price_member) {
            text = `Pris (Medlemmer): ${item.price_member}${mem_kr}`;
        } else {
            return '';
        }
        return text;
    }

    onTicketUrlPress(link) {
        Linking.openURL(link);
    }

    onFacebookUrlPress(link) {
        const fbEventPattern = /https?:\/\/www\.facebook\.com\/events\/(\d+)\/?/i;
        const matches = fbEventPattern.exec(link);
        let iosURL = link;
        if( matches.length ) {
            iosURL = 'fb://event/?id=' + matches[1];
        }
        const url = Platform.select({
            ios: iosURL,
            android: link
        });
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                return Linking.openURL(link);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    onLocationPress(venue) {
        if( venue !== 'Annetsteds' ) {
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${CHATEAU_NEUF_ADDRESS}`);
        }
    }

    showPriceAndTicket() {
        const {item} = this.props;
        const text = this._formatTicketText();

        if(text === '') {
            return;
        }

        if(item.ticket_url) {
            return (
                <TouchableOpacity style={styles.metaInner} onPress={() => this.onTicketUrlPress(item.ticket_url)}>
                    <View style={styles.metaIcon}><Icon name="card" style={styles.icons} /></View>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.metaText}>{text}</Text>
                        <Text style={styles.metaSubtitle}>Kjøp billett</Text>
                    </View>
                </TouchableOpacity>);
        }

        return (
            <View style={styles.metaInner}>
                <View style={styles.metaIcon}><Icon name="card" style={styles.icons} /></View>
                <View style={{flexDirection: 'column'}}>
                    <Text style={styles.metaText}>{text}</Text>
                    <Text style={styles.metaSubtitle}>Billett i døra</Text>
                </View>
            </View>)
    }

    showFacebutton() {
        const {item} = this.props;
        if (!item.facebook_url) { return;}

        return (
            <TouchableOpacity onPress={() => this.onFacebookUrlPress(item.facebook_url)} style={styles.metaInner}>
                <View style={[styles.metaIcon, {marginTop: 0}]}><Icon name="logo-facebook" style={styles.icons} /></View>
                <View>
                    <Text style={[styles.metaText, {paddingTop: 2}]}>På Facebook</Text>
                </View>
            </TouchableOpacity>
        );
    }

    showImage() {
        const {item} = this.props;

        if (item.thumbnail.medium_large) {
            return <Image source={{uri: item.thumbnail.medium_large}} style={styles.image} />;
        }
    }

    showYear() {
        const {item} = this.props;

        if(moment().year() !== moment(item.start_time).year()) {
            return <Text style={styles.year}>{this._formatYear(item.start_time)}</Text>
        }
    }

    render() {
        const {item} = this.props;

        return (
            <ScrollView>
                {this.showImage()}
                <View style={styles.card}>
                    {/* Date and title */}
                    <View style={styles.dateAndTitle}>
                        <View style={styles.dateContainer}>
                            <View style={styles.dateCard}>
                                <Text style={styles.day}>{this._formatDay(item.start_time)}</Text>
                                <Text style={styles.month}>{this._formatMonth(item.start_time)}</Text>
                                {this.showYear()}
                            </View>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title} numberOfLines={2}>{item.title.decoded}</Text>
                        </View>
                    </View>
                    {/* Time and calendar */}
                    <TouchableOpacity style={styles.metaInner}>
                        <View style={styles.metaIcon}><Icon name="time" style={styles.icons} /></View>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.metaText}>{this._formatLocalDay(item.start_time)} kl. {this._formatTime(item.start_time)} - {this._formatTime(item.end_time)}</Text>
                            <Text style={styles.metaSubtitle}>{this._formatRelative(item.start_time)}</Text>
                        </View>
                    </TouchableOpacity>
                    {/* Location and maps */}
                    <TouchableOpacity style={styles.metaInner} onPress={() => this.onLocationPress(item.venue)}>
                        <View style={[styles.metaIcon, {paddingLeft: 1}]}><Icon name="pin" style={styles.icons} /></View>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.metaText}>{item.venue}</Text>
                            <Text style={styles.metaSubtitle} numberOfLines={1}>{this._formatLocation()}</Text>
                        </View>
                    </TouchableOpacity>
                    {this.showPriceAndTicket()}
                    {this.showFacebutton()}
                    <HTMLView style={styles.content} stylesheet={HTMLStyles} value={item.content.rendered}/>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    dateAndTitle: {
        flexDirection: 'row',
        marginBottom: 8
    },
    titleContainer: {
        paddingLeft: 10,
        justifyContent: 'center',
        flex: 4,
    },
    title: {
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
    metaInner: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    metaIcon: {
        width: 16,
        paddingTop: 3,
        marginHorizontal: 8,
        marginVertical: 8,
    },
    metaText: {
        color: '#000',
    },
    metaSubtitle: {
        color: '#666',
    },
    content: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        marginTop: 8,
        paddingTop: 10,
    },
    dateContainer: {
        flex: 1,
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
        width: 62,
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
    icons: {
        fontSize: 16,
    },

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