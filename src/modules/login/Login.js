import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Container, Header, Content, Form, Item, Input, Label, Spinner, Button, Text as NBText, Icon} from 'native-base';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    emailInput() {
        if (this.props.loginError && this.props.loginError.username) {
            return <Item floatingLabel error>
                <Label>E-post / Brukernavn</Label>
                <Input
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onChangeText={this.handleEmail}
                    onSubmitEditing={(event) => {
                        this.passwordInputEl._root.focus();
                    }}
                />
            </Item>;
        }

        return <Item floatingLabel>
            <Label>E-post / Brukernavn</Label>
            <Input
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onChangeText={this.handleEmail}
                onSubmitEditing={(event) => {
                    this.passwordInputEl._root.focus();
                }}
            />
        </Item>;
    }

    passwordInput() {
        if (this.props.loginError && this.props.loginError.password) {
            return <Item floatingLabel last error>
                <Label>Passord</Label>
                <Input
                    secureTextEntry={true}
                    autoCapitalize="none"
                    getRef={(input) => {
                        this.passwordInputEl = input;
                    }}
                    onChangeText={this.handlePassword}
                    onSubmitEditing={this.onLoginPress}
                />
            </Item>
        }
        return <Item floatingLabel last>
            <Label>Passord</Label>
            <Input
                secureTextEntry={true}
                autoCapitalize="none"
                getRef={(input) => {
                    this.passwordInputEl = input;
                }}
                onChangeText={this.handlePassword}
                onSubmitEditing={this.onLoginPress}
            />
        </Item>
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <Form>
                        {this.emailInput()}
                        {this.passwordInput()}
                        {this.showError()}
                        <Button block onPress={this.onLoginPress} style={styles.loginButton}><NBText>Logg
                            inn</NBText></Button>
                        {this.showSpinner()}
                    </Form>
                </Content>
            </Container>
        );
    }

    showError = () => {
        if (this.props.loginError) {
            const err = this.props.loginError.non_field_errors;
            let errorFormatted = err ? err[0] : 'Feil brukernavn eller passord, prøv igjen...';
            // TODO: Format these and highlight error fields
            return <View style={styles.errorBox}><NBText style={styles.errorMessage}>{errorFormatted}</NBText></View>
        }
        else {
            return <View style={styles.errorBox}/>
        }
    };

    showSpinner = () => {
        if (this.props.isLoggingIn) {
            return <Spinner color="#f58220"/>
        }
    };

    handleEmail = (text) => {
        this.setState({email: text})
    };

    handlePassword = (text) => {
        this.setState({password: text})
    };

    onLoginPress = () => {
        this.props.requestLogin(this.state.email, this.state.password)
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    input: {
        width: 320,
        fontSize: 20,
        height: 52,
    },
    loginButton: {
        marginVertical: 16,
        marginHorizontal: 16
    },
    errorBox: {
        marginVertical: 16,
    },
    errorMessage: {
        textAlign: 'center',
        color: 'red',
    }
});