import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Text as NBText, Spinner} from 'native-base';
import Confetti from 'react-native-confetti';

import theme from "../../theme";

export default class Proof extends Component {
    CONFETTI_TIMEOUT = 15000;

    constructor(props) {
        super(props);
        this.state = {
            stopConfetti: false,
        }
    };

    componentDidUpdate () {
        if (this._confettiView && this.state.stopConfetti) {
            this._confettiView.stopConfetti();
            this.setState({stopConfetti: false});
        }
    }

    componentWillUnmount () {
        if (this._confettiView) {
            this._confettiView.stopConfetti();
        }
    }

    onMembershipPress = () => {
        this.setState({showConfetti: true}, () => {
            if(this._confettiView) {
                this._confettiView.startConfetti();
                setTimeout(function() {
                    this.setState({stopConfetti: true});
                }.bind(this), this.CONFETTI_TIMEOUT);
            }
        })
    };

    membershipValidTo() {
        if( !this.props.user.last_membership) {
            return;
        }

        let validTo = this.props.user.last_membership.end_date;
        if (this.props.user.last_membership.membership_type === 'lifelong') {
            validTo = 'Livsvarig'
        }

        return (
            <View style={{alignItems: 'center', flex: 1}}>
                <Text>Gyldig til: </Text>
                <Text style={styles.validToValue}>{validTo}</Text>
            </View>
        )
    }

    membershipStatus() {
        if (!this.props.user.is_member) {
            if ( !this.props.user.last_membership ) {
                return;
            }

            return (
                <View style={styles.expired}>
                    <Text style={styles.expiredText}>Utløpt</Text>
                </View>)
        }

        const statusText = this.props.user.is_volunteer ? '❤️ AKTIV ❤️ ' : 'MEDLEM';

        return (
            <View style={styles.membershipStatus}>
                <TouchableOpacity onPress={this.onMembershipPress} style={styles.valid}>
                    <Text style={styles.validText}>{statusText}</Text>
                </TouchableOpacity>
            </View>);
    }

    purchaseButton() {
        if (this.props.user.is_member) {
            return;
        }

        return (
            <View>
                {this.props.isChargingMembership && <Spinner color="#f58220"/>}
                <Button
                    onPress={this.props.onChargePress}
                    full
                    disabled={this.props.isChargingMembership || this.props.isLoadingMembershipType}
                    style={styles.purchaseButton}
                >
                    <NBText>{`Kjøp medlemskap (${this.props.membershipPrice} NOK)`}</NBText>
                </Button>
                <View style={styles.purchaseText}>
                    <Text style={styles.purchaseTextInner}>Medlemskapet er gyldig i ett år</Text>
                </View>
            </View>)
    }

    confetti() {
        if (this.props.user.is_member) {
            // Confetti!!!!
            return <Confetti ref={(node) => this._confettiView = node} confettiCount={Number.MAX_SAFE_INTEGER} />
        }
    }

    logo() {
        if (!this.props.user.is_member) {
            return;
        }

        // FIXME: URL to config
        return (
            <View style={{marginTop: 8}}>
                <Image
                    style={{width: null, height: 100}}
                    source={{uri: 'https://galtinn.neuf.no/static/dist/images/logo.png'}}
                    resizeMode="contain"
                />
            </View>)
    }

    chargeError() {
        if (!this.props.chargeError) {
            return;
        }

        return <View><Text style={styles.errorMessage}>{this.props.chargeError}</Text></View>
    }

    render() {
        return (
            <View>
                {this.confetti()}
                <ScrollView>
                    <View style={[styles.card, {paddingVertical: 16}]}>
                        {this.membershipName()}
                        {this.logo()}
                        {this.membershipStatus()}
                        {this.chargeError()}
                        {this.purchaseButton()}
                        {this.membershipValidTo()}
                    </View>
                    <View>
                        <Button onPress={this.props.onLogoutPress} style={styles.logoutButton} small>
                            <NBText>Logg ut</NBText>
                        </Button>
                    </View>
                </ScrollView>
            </View>
        )
    };

    membershipName() {
        let name = `${this.props.user.first_name} ${this.props.user.last_name}`;
        if(name === ' ') {
            name = this.props.user.email;
        }
        return <View>
            <Text style={styles.nameText}>{name}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    card: theme.card,
    membershipStatus: {
        marginVertical: 16,
    },
    nameText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    valid: {
        backgroundColor: '#5cb85c',
        flex: 1,
        marginHorizontal: -16,
        padding: 16
    },
    validText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: "800"
    },
    expired: {
        backgroundColor: '#d9534f',
        flex: 1,
        marginHorizontal: -16,
        padding: 16,
        marginVertical: 16,
    },
    expiredText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24
    },
    notMember: {
        backgroundColor: '#62B1F6',
        flex: 1,
        marginHorizontal: -16,
        padding: 16
    },
    notMemberText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24
    },
    validToValue: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    purchaseButton: {
        marginTop: 16,
    },
    logoutButton: {
        alignSelf: 'center',
        marginVertical: 20,
    },
    purchaseText: {
        alignItems: 'center'
    },
    purchaseTextInner: {
        fontStyle: 'italic',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 8
    },
    errorMessage: {
        paddingTop: 10,
        textAlign: 'center',
        color: theme.colors.danger
    }
});