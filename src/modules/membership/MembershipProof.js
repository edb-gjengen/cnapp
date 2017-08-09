import React, {Component} from 'react';
import {Linking, StyleSheet, Platform, RefreshControl, View} from "react-native";
import {Button, Body, Card, CardItem, Text, Content} from 'native-base';
import Config from 'react-native-config';
import Confetti from 'react-native-confetti';

export default class MembershipProof extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            refreshing: false,
        }
    };

    componentWillReceiveProps(nextProps) {
        if(this.state.user !== nextProps.user) {
            this.setState({user: nextProps.user})
        }
    }
    componentDidMount() {
        if(this._confettiView) {
            this._confettiView.startConfetti();
        }
    }

    componentWillUnmount () {
        if (this._confettiView) {
            this._confettiView.stopConfetti();
        }
    }

    // fetchUser = () => {
    //     this.props.fetchUser().then(() => {
    //         this.setState({refreshing: false});
    //     });
    // };

    // _onRefresh() {
    //     console.log('onRefresh')
    //     this.setState({refreshing: true});
    //     this.fetchUser()
    // }

    // refreshControl() {
    //     return (
    //         <RefreshControl
    //             refreshing={this.state.refreshing}
    //             onRefresh={this._onRefresh.bind(this)}
    //         />)
    // }

    membershipValidTo() {
        if( !this.state.user.last_membership) {
            return;
        }

        let validTo = this.state.user.last_membership.end_date;
        if (this.state.user.last_membership.membership_type === 'lifelong') {
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
        if (!this.state.user.is_member) {
            // TODO: purchase membership button
            if ( !this.state.user.last_membership ) {
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
        if (this.state.user.is_volunteer) {
            statusText = 'Aktiv';
        }

        return <CardItem><View style={styles.valid}><Text style={styles.validText}>{statusText}</Text></View></CardItem>
    }

    purchaseButton() {
        if (this.state.user.is_member) {
            return;
        }
        return <CardItem>
            <Body>
                <Button
                    onPress={() => {
                        Linking.openURL(Config.DUSKEN_PURCHASE_URL);
                    }}
                    full
                    style={styles.purchaseButton}
                >
                    <Text>Kjøp medlemskap</Text>
                </Button>
            </Body>
        </CardItem>
    }

    confetti() {
        if (this.state.user.is_member) {
            // FIXME: allmost infinite confetti. Are the animations paused when not visible, if not power hog?
            return <Confetti ref={(node) => this._confettiView = node} confettiCount={Number.MAX_SAFE_INTEGER} />
        }
    }

    fetchUser = () => {
        this.props.fetchUser()
    };

    render() {
        return (
            <View style={{flex: 1}}>
                {this.confetti()}
                <Content style={{margin: 8}}>
                    <Card>
                        {this.membershipName()}
                        {this.membershipStatus()}
                        {this.purchaseButton()}
                        {this.membershipValidTo()}
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <Button onPress={this.props.onLogoutPress} style={styles.logoutButton} small>
                                    <Text>Logg ut</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </View>
        )
    };

    membershipName() {
        let name = `${this.state.user.first_name} ${this.state.user.last_name}`;
        if(name === ' ') {
            name = this.state.user.email;
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
        marginVertical: 8,
    },
});