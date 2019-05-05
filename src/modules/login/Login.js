import React, { Component } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Spinner, Button, Text } from 'native-base';
import Config from 'react-native-config';
import theme from '../../theme';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  emailInput() {
    if (this.props.loginError && this.props.loginError.username) {
      return (
        <Item stackedLabel last error>
          <Label>E-post / Brukernavn</Label>
          <Input
            keyboardType="email-address"
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onChangeText={this.handleEmail}
            onSubmitEditing={() => {
              this.passwordInputRef._root.focus();
            }}
          />
        </Item>
      );
    }

    return (
      <Item stackedLabel last>
        <Label>E-post / Brukernavn</Label>
        <Input
          keyboardType="email-address"
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onChangeText={this.handleEmail}
          onSubmitEditing={() => {
            this.passwordInputRef._root.focus();
          }}
        />
      </Item>
    );
  }

  passwordInput() {
    if (this.props.loginError && this.props.loginError.password) {
      return (
        <Item stackedLabel last error>
          <Label>Passord</Label>
          <Input
            ref={(ref) => {
              this.passwordInputRef = ref;
            }}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={this.handlePassword}
            onSubmitEditing={this.onLoginPress}
          />
        </Item>
      );
    }
    return (
      <Item stackedLabel last>
        <Label>Passord</Label>
        <Input
          ref={(ref) => {
            this.passwordInputRef = ref;
          }}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={this.handlePassword}
          onSubmitEditing={this.onLoginPress}
        />
      </Item>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content keyboardShouldPersistTaps="always">
          <Form style={styles.card}>
            {this.emailInput()}
            {this.passwordInput()}
            {this.showError()}
            <Button full onPress={this.onLoginPress} style={styles.loginButton}>
              <Text>Logg inn</Text>
            </Button>
            <Button
              small
              light
              onPress={() => {
                Linking.openURL(Config.DUSKEN_FORGOT_PASSWORD_URL);
              }}
              style={styles.forgotPasswordButton}
            >
              <Text>Glemt passord?</Text>
            </Button>
            {this.showSpinner()}
          </Form>
        </Content>
      </Container>
    );
  }

  showError = () => {
    if (this.props.loginError) {
      const err = this.props.loginError.non_field_errors;
      const errorFormatted = err ? err[0] : 'Feil brukernavn eller passord, prøv igjen...';
      // TODO: Format these and highlight error fields
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorMessage}>{errorFormatted}</Text>
        </View>
      );
    }

    return <View style={styles.errorBox} />;
  };

  showSpinner = () => (this.props.isLoggingIn ? <Spinner color="#f58220" /> : null);

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  onLoginPress = () => {
    this.props.requestLogin(this.state.email, this.state.password);
  };
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
  loginButton: {
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  errorBox: {
    marginVertical: 10,
  },
  errorMessage: {
    textAlign: 'center',
    color: 'red',
  },
  card: theme.card,
});
