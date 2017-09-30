import stripe from 'tipsi-stripe'
import React, {Component} from 'react';
import Config from 'react-native-config';
import {ActivityIndicator, Text, View} from "react-native";
// import {ScrollView, Text, View, Linking, StyleSheet, Platform} from "react-native";
// import {Button, Text as NBText} from "native-base";

stripe.init({
    publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
});

export default class Charge extends Component {
    render() {
        return <View>
            <Text>In charge view</Text>
            <ActivityIndicator/>
        </View>
    }

    openStripe() {
        stripe.createTokenWithCard().then((data) => {
            // returns a token.tokenId which should be saved

        })
    }
}
