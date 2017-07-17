import React, { Component } from 'react';
import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';

import { loginStart } from "../../actions";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.loggedIn !== nextProps.loggedIn) {
      this.setState({
        loggedIn: nextProps.loggedIn
      })
    }
  }

  render() {
    const pic = {
      uri: 'https://dusken.neuf.no/static/dist/images/logo.png'
    };
    return (
      <View style={styles.container}>
        <Text style={styles.text}>The Norwegian Student Society</Text>
        <Text style={styles.text}>Chateau Neuf</Text>
        <Image source={pic} style={{width: 200, height: 150, marginBottom: 40}} resizeMode='contain' />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={(event) => {
              this.refs.passwordInput.focus();
          }}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={true}
          autoCapitalize="none"
          ref='passwordInput'
          onSubmitEditing={this.onLoginPress}
        />
        <View style={styles.button}>
          <Button
            title="Log in"
            onPress={this.onLoginPress}
          />
        </View>
        <Text style={{paddingTop: 10}}>{this.loginState()}</Text>
      </View>
    );
  }

  onLoginPress = () => {
    console.log("YO from onLoginPress");
    this.props.dispatch(loginStart())
  };

  loginState() {
    if(this.state.loggedIn) {
      return 'LOGGED IN'
    }
    return 'NOT YET'
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
    width: 240,
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