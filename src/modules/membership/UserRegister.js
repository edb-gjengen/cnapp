import React, {Component} from 'react';
import {Container, Header, Content, Form, Item, Input, Label, Spinner, Button, Text, Icon} from 'native-base';
import {Platform, StyleSheet, View} from "react-native";

export default class UserRegister extends Component {
    emailInput() {
        return <Item stackedLabel>
            <Label>E-post</Label>
            <Input
                ref="emailInput"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={this.handleEmail}
                onSubmitEditing={() => {
                    this.refs.phoneInput._root.focus()
                }}
            />
        </Item>;
    }

    passwordInput() {
        // FIXME: How to dynamicly set error attribute? replace component, what?
        return <Item stackedLabel last>
            <Label>Passord</Label>
            <Input
                ref="passwordInput"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={this.handlePassword}
                onSubmitEditing={this.onLoginPress}
            />
        </Item>
    }

    showError = () => {
        if (this.props.loginError) {
            const err = this.props.loginError.non_field_errors;
            let errorFormatted = err ? err[0] : 'Generell feil, prøv igjen...';
            // TODO: Format these and highlight error fields
            return <View style={styles.errorBox}><Text style={styles.errorMessage}>{errorFormatted}</Text></View>
        }
        else {
            return <View style={styles.errorBox}/>
        }
    };

    showSpinner = () => {
        if (this.props.isSubmitted) {
            return <Spinner color="#f58220"/>
        }
    };

    render() {
        return (
            <Container style={styles.container}>
                <Content keyboardShouldPersistTaps='always'>
                    <Form style={styles.card}>
                        <Item stackedLabel>
                            <Label>Fornavn</Label>
                            <Input
                                autoFocus={true}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.refs.lastNameInput._root.focus()
                                }}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label>Etternavn</Label>
                            <Input
                                ref="lastNameInput"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.refs.emailInput._root.focus()
                                }}
                            />
                        </Item>
                        {this.emailInput()}
                        <Item stackedLabel>
                            <Label>Mobilnummer</Label>
                            <Input
                                ref="phoneInput"
                                returnKeyType="next"
                                keyboardType="phone-pad"
                                onSubmitEditing={() => {
                                    this.refs.passwordInput._root.focus()
                                }}
                            />
                        </Item>
                        {this.passwordInput()}
                        {this.showError()}
                        <Button full onPress={this.onRegisterPress} style={styles.registerButton}>
                            <Text>Registrer</Text>
                        </Button>
                        {this.showSpinner()}
                    </Form>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        width: 320,
        fontSize: 20,
        height: 52,
    },
    registerButton: {
        marginBottom: 16,
    },
    errorBox: {
        marginVertical: 10,
    },
    errorMessage: {
        textAlign: 'center',
        color: 'red',
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
});