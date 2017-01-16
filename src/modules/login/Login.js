import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MKButton, MKColor, MKTextField } from 'react-native-material-kit';

import { loginStart } from "../../actions";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log("IN Login.componentWillReceiveProps");
    console.log(nextProps);
    if(this.state.loggedIn != nextProps.loggedIn) {
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
        <Text>Chateau Neuf</Text>
        <Text>The Norwegian Student Society</Text>
        <Image source={pic} style={{width: 200, height: 150, marginBottom: 40}} resizeMode='contain' />
        <MKTextField
          placeholder="Email"
          style={styles.input}
        />
        <MKTextField
          placeholder="Password"
          style={styles.input}
        />
        <MKButton
          backgroundColor={MKColor.Blue}
          shadowRadius={2}
          shadowOpacity={.7}
          shadowColor="black"
          onPress={this.onLoginPress}
          style={{marginTop: 20}}
        >
          <Text pointerEvents="none" style={styles.button}>Log in</Text>
        </MKButton>
        <Text style={{paddingTop: 10}}>{this.loginState()}</Text>
      </View>
    );
  }
  onLoginPress = () => {
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
    height: 50,
  },
  button: {
    fontWeight: 'bold',
    padding: 10,
    width: 240,
    textAlign: 'center',
    color: 'white',
  }
});