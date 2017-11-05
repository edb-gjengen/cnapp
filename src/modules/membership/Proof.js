import React, {Component} from 'react';
import {Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Text as NBText} from 'native-base';
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

        const statusText = this.props.user.is_volunteer ? 'Aktiv' : 'Medlem';

        return (
            <View>
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
                <Button
                    onPress={this.props.onChargePress}
                    full
                    style={styles.purchaseButton}
                >
                    <NBText>Kjøp medlemskap (200 NOK)</NBText>
                </Button>
                <View style={styles.purchaseText}>
                    <Text style={styles.purchaseTextInner}>Medlemskapet er gyldig i ett år</Text>
                </View>
            </View>)
    }

    confetti() {
        if (this.props.user.is_member) {
            // FIXME: allmost infinite confetti. Are the animations paused when not visible, if not power hog?
            return <Confetti ref={(node) => this._confettiView = node} confettiCount={Number.MAX_SAFE_INTEGER} />
        }
    }

    logo() {
        if (!this.props.user.is_member) {
            return;
        }
        // FIXME: URL to config
        return <Image
            style={{width: null, height: 100}}
            source={{uri: 'https://galtinn.neuf.no/static/dist/images/logo.png'}}
            resizeMode="contain"
        />
    }


    render() {
        return (
            <ScrollView>
                {this.confetti()}
                <View style={styles.card}>
                    {this.membershipName()}
                    {this.logo()}
                    {this.membershipStatus()}
                    {this.purchaseButton()}
                    {this.membershipValidTo()}
                </View>
                <View>
                    <Button onPress={this.props.onLogoutPress} style={styles.logoutButton} small>
                        <NBText>Logg ut</NBText>
                    </Button>
                </View>
            </ScrollView>
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
        fontSize: 24
    },
    expired: {
        backgroundColor: '#d9534f',
        flex: 1,
        marginHorizontal: -16,
        padding: 16
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
    }
});