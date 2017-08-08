import React, {Component} from 'react';
import {StyleSheet, Platform, RefreshControl, View} from "react-native";
import {Button, Card, CardItem, Text, Content} from 'native-base';

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

    validTo() {
        if (this.state.user.last_membership.membership_type === 'lifelong') {
            return 'Livsvarig'
        }
        return this.state.user.last_membership.end_date;
    }

    membershipStatus() {
        if (!this.state.user.is_member) {
            if (!this.state.user.last_membership) {
                // TODO: purchase membership button
                return <View style={styles.notMember}><Text style={styles.notMemberText}>Ikke medlem</Text></View>
            }

            return <View style={styles.expired}><Text style={styles.expiredText}>Utløpt</Text></View>
        }

        if (this.state.user.is_volunteer) {
            return <View style={styles.valid}><Text style={styles.validText}>Aktiv frivillig</Text></View>
        }

        return <View style={styles.valid}><Text style={styles.validText}>Medlem</Text></View>
    }

    fetchUser = () => {
        this.props.fetchUser()
    };

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

    render() {
        return (
            <Content>
                <Card>
                    <CardItem>
                        <Text style={styles.nameText}>{this.state.user.first_name} {this.state.user.last_name}</Text>
                    </CardItem>
                    <CardItem>
                        {this.membershipStatus()}
                    </CardItem>
                    <CardItem>
                        <View style={{alignItems: 'center', flex: 1}}>
                        <Text>Gyldig til: </Text>
                        <Text style={styles.validToValue}>{this.validTo()}</Text>
                        </View>
                    </CardItem>
                    <CardItem>
                        <Button onPress={this.props.onLogoutPress} style={styles.logoutButton}><Text>Logg ut</Text></Button>
                    </CardItem>
                </Card>
            </Content>
        )
    };
}

const styles = StyleSheet.create({
    nameText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 16,
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
        backgroundColor: '#62B1F6',
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
});