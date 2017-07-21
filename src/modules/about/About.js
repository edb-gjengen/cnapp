import React, { Component } from 'react';
import {Text, ScrollView, View, Platform, StyleSheet, Image} from "react-native";

export default class About extends Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.card}>
                    <Text style={styles.header}>Chateau Neuf</Text>
                    <Image source={{uri: 'https://studentersamfundet.no/wp-content/uploads/2015/04/26_KUL_Chateauneuf-1280x720.jpg'}} style={styles.featuredImage} resizeMode="contain" />
                    <Text style={styles.paragraph}>Studentene i Oslo har sitt naturlige tilholdssted på Det Norske Studentersamfund, i hyggelige lokaler på Chateau Neuf øverst på Majorstuen. Her er det åpent alle dager unntatt søndag, og hver dag skjer det en rekke ting i våre mange arrangementslokaler. Enten man ønsker en tur i baren, på kafé, på debatt, på konsert, teater eller kino, har man muligheten på Chateau Neuf.</Text>
                    <Text style={styles.paragraph}>Chateau Neuf er et frivillig drevet studenthus. Studenter over alt i Oslo kan komme hit og få nyttig og spennende erfaring med å drive et av Oslos største kulturhus. Her kan du stå i bar, sette lys og lyd, jobbe med markedsføring, produsere konserter, bli kjent med hundrevis av bra mennesker og få minner for livet.</Text>
                    <Text style={styles.paragraph}>Alle studentforeninger i Oslo kan arrangere gratis på Chateau Neuf. Skal du arrangere en fest, sette en konsert, holde et foredrag eller gjennomføre et møte, har vi lokaler som kan brukes til dette.</Text>
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
    featuredImage: {
        height: 230,
    }
});