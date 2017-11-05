import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, Body, Card, CardItem, Container, Content, Text} from 'native-base';
import Confetti from 'react-native-confetti';

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
            <CardItem>
                <View style={{alignItems: 'center', flex: 1}}>
                    <Text>Gyldig til: </Text>
                    <Text style={styles.validToValue}>{validTo}</Text>
                </View>
            </CardItem>
        )
    }

    membershipStatus() {
        if (!this.props.user.is_member) {
            if ( !this.props.user.last_membership ) {
                return (
                    <CardItem>
                        <View style={styles.notMember}>
                            <Text style={styles.notMemberText}>Ikke medlem</Text>
                        </View>
                    </CardItem>)
            }

            return <View style={styles.expired}><Text style={styles.expiredText}>Utløpt</Text></View>
        }

        let statusText = 'Medlem';
        if (this.props.user.is_volunteer) {
            statusText = 'Aktiv';
        }

        return (
            <CardItem>
                <TouchableOpacity onPress={this.onMembershipPress} style={styles.valid}>
                    <Text style={styles.validText}>{statusText}</Text>
                </TouchableOpacity>
            </CardItem>);
    }

    purchaseButton() {
        if (this.props.user.is_member) {
            return;
        }
        return <CardItem>
            <Body>
                <Button
                    onPress={this.props.onChargePress}
                    full
                    style={styles.purchaseButton}
                >
                    <Text>Kjøp medlemskap</Text>
                </Button>
            </Body>
        </CardItem>
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
            <Container>
                {this.confetti()}
                <Content style={{margin: 8}}>
                    <Card>
                        {this.membershipName()}
                        {this.logo()}
                        {this.membershipStatus()}
                        {this.purchaseButton()}
                        {this.membershipValidTo()}
                    </Card>
                    <Button onPress={this.props.onLogoutPress} style={styles.logoutButton} small>
                        <Text>Logg ut</Text>
                    </Button>
                </Content>
            </Container>
        )
    };

    membershipName() {
        let name = `${this.props.user.first_name} ${this.props.user.last_name}`;
        if(name === ' ') {
            name = this.props.user.email;
        }
        return <CardItem>
            <Text style={styles.nameText}>{name}</Text>
        </CardItem>
    }
}

const styles = StyleSheet.create({
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
});