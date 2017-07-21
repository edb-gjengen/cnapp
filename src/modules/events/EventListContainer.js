import {connect} from "react-redux";
import EventList from "./EventList";

import React from 'react';

/* Ref: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6 */

class EventListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            events: [],
            page: 1,
            error: null,
            refreshing: false,
        };
    }

    fetchEvents() {
        const { page } = this.state;
        const url = `https://studentersamfundet.no/wp-json/wp/v2/events?future=1`; //&page=${page}&results=20`;
        this.setState({ loading: true });
        fetch(url)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({
                    events: page === 1 ? res : [...this.state.events, ...res],
                    error: res.error || null,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    }

    componentDidMount() {
        this.fetchEvents();
    }

    render() {
        return (<EventList {...this.state} />)
    }
}

export default connect()(EventListContainer);