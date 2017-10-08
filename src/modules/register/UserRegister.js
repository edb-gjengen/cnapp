import React, {Component} from 'react';
import {Container, Header, Content, Form, Item, Input, Label, Spinner, Button, Text, Icon, Toast} from 'native-base';
import {Platform, StyleSheet, View} from "react-native";

export default class UserRegister extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            errors: {},
            touched: new Set()
        }
    };

    validateForm(triggeredBy) {
        const fieldNames = ['firstName', 'lastName', 'email', 'phoneNumber', 'password'];

        let errors = Object.assign({}, this.state.errors);
        let touched = new Set(this.state.touched).add(triggeredBy);

        /* No empty fields */
        for(let key of fieldNames) {
            const value = this.state[key];
            if(value === '') {
                errors[key] = 'Feltet kan ikke være tomt';
            } else {
                delete errors[key];
            }
        }

        this.setState({errors: errors, touched});
    };

    fieldHasError(field) {
        return this.state.touched.has(field) && field in this.state.errors;
    }

    canSubmitForm() {
        return Object.keys(this.state.errors).length === 0;
    }

    firstNameInput() {
        return <Item error={this.fieldHasError('firstName')}>
            <Label>Fornavn</Label>
            <Input
                autoFocus={true}
                returnKeyType="next"
                onChangeText={(text) => {
                    this.setState({firstName: text}, () => { this.validateForm('firstName'); });
                }}
                onSubmitEditing={() => {
                    this.refs.lastNameInput._root.focus()
                }}
            />
            {this.fieldHasError('firstName') && <Icon name='close-circle' />}
        </Item>;
    }

    lastNameInput() {
        return <Item error={this.fieldHasError('lastName')}>
            <Label>Etternavn</Label>
            <Input
                ref="lastNameInput"
                returnKeyType="next"
                onChangeText={(text) => {
                    this.setState({lastName: text}, () => { this.validateForm('lastName'); });
                }}
                onSubmitEditing={() => {
                    this.refs.emailInput._root.focus()
                }}
            />
            {this.fieldHasError('lastName') && <Icon name='close-circle' />}
        </Item>;
    }

    emailInput() {
        return <Item error={this.fieldHasError('email')}>
            <Label>E-post</Label>
            <Input
                ref="emailInput"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={(text) => {
                    this.setState({email: text}, () => { this.validateForm('email'); });
                }}
                onSubmitEditing={() => {
                    this.refs.phoneInput._root.focus()
                }}
            />
            {this.fieldHasError('email') && <Icon name='close-circle' />}
        </Item>;
    }

    phoneNumberInput() {
        return <Item error={this.fieldHasError('phoneNumber')}>
            <Label>Mobilnummer</Label>
            <Input
                ref="phoneInput"
                returnKeyType="next"
                keyboardType="phone-pad"
                onChangeText={(text) => {
                    this.setState({phoneNumber: text}, () => { this.validateForm('phoneNumber'); });
                }}
                onSubmitEditing={() => {
                    this.refs.passwordInput._root.focus()
                }}
            />
            {this.fieldHasError('phoneNumber') && <Icon name='close-circle' />}
        </Item>;
    }

    passwordInput() {
        return <Item error={this.fieldHasError('password')}>
            <Label>Passord</Label>
            <Input
                ref="passwordInput"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                    this.setState({password: text}, () => { this.validateForm('password'); });
                }}
                onSubmitEditing={this.onRegisterPress}
            />
            {this.fieldHasError('password') && <Icon name='close-circle' />}
        </Item>
    }

    showError = () => {
        // TODO: Move these from prop to state in componentWillRecieveProps
        // TODO: Format these and highlight error fields
        if (this.props.registerError && Object.keys(this.props.registerError).length !== 0) {
            const err = this.props.registerError.non_field_errors;
            let errorFormatted = err ? err[0] : 'Kunne ikke registrere bruker, prøv igjen...';
            return <View style={styles.errorBox}><Text style={styles.errorMessage}>{errorFormatted}</Text></View>
        }
        else {
            return <View style={styles.errorBox}/>
        }
    };

    showSpinner = () => {
        if (this.props.isRegisteringUser) {
            return <Spinner color="#f58220"/>
        }
    };

    render() {
        return (
            <Container style={styles.container}>
                <Content keyboardShouldPersistTaps='always'>
                    <Form style={styles.card}>
                        {this.firstNameInput()}
                        {this.lastNameInput()}
                        {this.emailInput()}
                        {this.phoneNumberInput()}
                        {this.passwordInput()}
                        {this.showError()}
                        {this.registerbutton()}
                        {this.showSpinner()}
                    </Form>
                </Content>
            </Container>
        );
    }

    onRegisterPress = () => {
        if( !this.validateForm() ) {
            Toast.show({
                text: 'Noen av feltene er ikke fylt ut riktig',
                position: 'bottom',
                buttonText: 'OK',
                duration: 1500,
            });
            return;
        }

        this.props.onRegisterPress(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.phoneNumber,
            this.state.password,
        );
    };

    registerbutton() {
        const isDisabled = this.props.isRegisteringUser || !this.canSubmitForm();

        return (<Button
            full
            disabled={isDisabled}
            onPress={this.onRegisterPress}
            style={styles.registerButton}
        >
            <Text>Registrer meg</Text>
        </Button>);
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