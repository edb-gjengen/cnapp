import React, {Component} from 'react';
import {StyleSheet, Platform, RefreshControl} from "react-native";
import {Card, CardItem, Text, Content} from 'native-base';

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
        if (this.state.user.last_membership.membership_type == 'lifelong') {
            return 'Livsvarig'
        }
        return this.state.user.last_membership.end_date;
    }

    statusText() {
        if (!this.state.user.is_member) {
            if (!this.state.user.last_membership) {
                return 'Ikke medlem'
            }
            return 'Utløpt'
        }
        if (this.state.user.is_volunteer) {
            return 'Aktiv'
        }
        return 'Medlem'
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
                        <Text>{this.statusText()}</Text>
                    </CardItem>
                    <CardItem>
                        <Text>Gyldig til: {this.validTo()}</Text>
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
});