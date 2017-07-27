import React, {Component} from 'react';
import {ScrollView, Text, View, Linking, StyleSheet, Platform} from "react-native";
import {Button, Text as NBText} from "native-base";

export default class Membership extends Component {
    render() {
        return (
            <ScrollView>
                <View style={styles.card}>
                    <Text style={styles.paragraph}>Siden 1813 har Det Norske Studentersamfund samlet studenter til kulturell, politisk, faglig og ikke minst sosial aktivitet. Som medlem i DNS er du med på å understreke viktigheten til en felles møteplass for alle Oslos studenter, uavhengig av utdanningsinstitusjon, studie og hvem de er.</Text>
                    <Text style={styles.paragraph}>Vi setter pris på felleskapet som er med på å bygge Chateau Neuf. DNS er en organisasjon av og for medlemmene. Derfor sørger vi for at det blir litt lettere å være student ved å ta en del av kaka for medlemmene våre. Med medlemskap får billigere inngang og servering på alt som skjer på Chateau Neuf.</Text>

                    <View style={styles.button}>
                        <Button onPress={this.onPurchasePress} full><NBText>Kjøp medlemskap</NBText></Button>
                    </View>

                    <Text style={styles.paragraph}>Vi gir medlemmer:{"\n"}
                        - Minst 25% rabatt på de fleste arrangement{"\n"}
                        - Gratis inngang på enkelte arrangement{"\n"}
                        - Store rabatter i barene{"\n"}
                        - Egne medlemsarrangement og -tilbud{"\n"}
                        - Mulighet til å delta i landets eldste studentdemokrati</Text>
                </View>
            </ScrollView>
        )
    }

    onPurchasePress() {
        // FIXME: Move this to process.env.DUSKEN_URL and use babel thing to do search replace
        Linking.openURL('https://medlem.neuf.no');
    }
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
        fontSize: 16,
        color: '#000',
        paddingBottom: 10,
        lineHeight: 25,
    },
    button: {
        marginTop: 6,
        marginBottom: 16,
    }
});