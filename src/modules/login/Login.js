import React, { Component } from 'react';
import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import { Spinner } from 'native-base';

// import { login } from "../../actions";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isLoggingIn: false,
      errorMessage: null,
      email: '',
      password: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.isAuthenticated !== nextProps.isAuthenticated) {
      this.setState({
        isAuthenticated: nextProps.isAuthenticated
      })
      if (nextProps.isAuthenticated) {
        this.onLogin();
      }
    }
    if(this.state.isLoggingIn !== nextProps.isLoggingIn) {
      this.setState({
        isLoggingIn: nextProps.isLoggingIn
      })
    }
    if(this.state.errorMessage !== nextProps.errorMessage) {
      this.setState({
        errorMessage: nextProps.errorMessage
      })
    }
  }

  render() {
    const pic = {
      uri: 'https://dusken.neuf.no/static/dist/images/logo.png'
    };
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Det Norske Studentersamfund</Text>
        <Text style={styles.text}>Chateau Neuf</Text>
        <Image source={pic} style={{width: 200, height: 150, marginBottom: 40}} resizeMode='contain' />
        <TextInput
          placeholder="E-post"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={this.handleEmail}
          onSubmitEditing={(event) => {
              this.refs.passwordInput.focus();
          }}
        />
        <TextInput
          placeholder="Passord"
          style={styles.input}
          secureTextEntry={true}
          autoCapitalize="none"
          ref='passwordInput'
          onChangeText={this.handlePassword}
          onSubmitEditing={this.onLoginPress}
        />
        <View style={styles.button}>
          <Button
            title="Logg inn"
            onPress={this.onLoginPress}
          />
        </View>
        {this.spinIfLoggingIn}
      </View>
    );
  }

  spinIfLoggingIn = () => {
    if (this.state.isLoggingIn) {
      return <Spinner color="#f58220"></Spinner>
    }
  }

  handleEmail = (text) => {
    this.setState({ email: text })
  };

  handlePassword = (text) => {
    this.setState({ password: text })
  };

  onLoginPress = () => {
    this.props.requestLogin(this.state.email, this.state.password)
  };

  onLogin = () => {
    this.props.onLogin();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    width: 320,
    fontSize: 20,
    height: 52,
  },
  button: {
    marginTop: 20,
    padding: 10,
    width: 240,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});