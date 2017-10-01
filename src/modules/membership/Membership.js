import React, {Component} from 'react';
import {ScrollView, Text, View, Linking, StyleSheet, Platform} from "react-native";
import {Button, Text as NBText} from "native-base";
export default class Membership extends Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.card}>
                    <Text style={styles.headerTitle}>Hei 👋</Text>
                    <Text style={styles.paragraph}>Her kan du bli medlem i Det Norske Studentersamfund - Chateau Neuf og ha medlemsbeviset ditt på telefonen</Text>
                    <View style={styles.button}>
                        <Button onPress={this.props.onRegisterPress} full><NBText>Bli medlem</NBText></Button>
                    </View>
                    <Text style={styles.header}>Hva får jeg?</Text>
                    <Text style={[styles.paragraph, {textAlign: 'left', paddingLeft: 4}]}>
                        - Minst 25% rabatt på de fleste arrangement{"\n"}
                        - Gratis inngang på enkelte arrangement{"\n"}
                        - Store rabatter i barene{"\n"}
                        - Egne medlemsarrangement og -tilbud{"\n"}
                        - Mulighet til å delta i landets eldste studentdemokrati</Text>
                    <Text style={styles.em}>Allerede medlem?</Text>
                    <View style={styles.button}>
                        <Button onPress={this.props.onLoginPress} full><NBText>Logg inn</NBText></Button>
                    </View>
                </View>
            </ScrollView>
        )
    };

}


const styles = StyleSheet.create({
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
    paragraph: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
        paddingBottom: 10,
        lineHeight: 25,
    },
    button: {
        marginTop: 6,
        marginBottom: 16,
    },
    em: {
        fontSize: 16,
        color: '#000',
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 10,
    },
    headerTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000',
        paddingVertical: 10,
        lineHeight: 25,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        lineHeight: 25,
        paddingLeft: 2
    },
});