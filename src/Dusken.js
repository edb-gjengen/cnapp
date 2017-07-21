import React, { Component } from 'react';
import LoginContainer from './modules/login/LoginContainer';
import EventListContainer from "./modules/events/EventListContainer";

export default class Dusken extends Component {
  render() {
    // TODO: Navigation++
    return (
      <EventListContainer />
    )
  }
}