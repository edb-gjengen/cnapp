import {connect} from "react-redux";

import React, {Component} from 'react';
import Config from 'react-native-config';
import moment from "moment";
import 'moment/locale/nb';

import EventList from "./EventList";

moment.locale('nb');

/* Ref: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6 */
class EventListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            events: [],
            eventsSectioned: [],
            page: 1,
            totalPages: 0,
            error: null,
            refreshing: false,
        };
    }

    _formatDate(time) {
        const m = moment(time);
        if(moment().year() === m.year() ) {
            return m.format('D. MMM')
        }
        return m.format('ll');
    }

    _toSectionFormat(events) {
        let sectioned = {};
        events.map((event) => {
            const title = this._formatDate(event.start_time);
            if( title in sectioned ) {
                sectioned[title].push(event);
            } else {
                sectioned[title] = [event];
            }
        });

        let sectionedList = [];
        Object.entries(sectioned).forEach(([title, section]) => {
            sectionedList.push({data: section, title: title});
        });

        return sectionedList;
    }

    handleRefresh = () => {
        this.setState({
            page: 1,
            refreshing: true,
            totalPages: 1,
        }, () => {
            this.fetchEvents()
        });
    };

    handleLoadMore = () => {
        if(this.state.page >= this.state.totalPages || this.state.loading) {
            return;
        }
        this.setState({
            page: this.state.page + 1,
        }, () => {
          this.fetchEvents();
        })
    };

    fetchEvents() {
        const { page } = this.state;
        const url = `${Config.EVENT_API_URL}/wp-json/wp/v2/events?page=${page}&future=1`;
        this.setState({ loading: true });

        fetch(url)
            .then(res => {
                this.setState({totalPages: parseInt(res.headers.get('x-wp-totalpages'))});
                return res.json();
            })
            .then(res => {
                this.setState({
                    events: page === 1 ? res : [...this.state.events, ...res],
                    eventsSectioned: page === 1 ? this._toSectionFormat(res) : this._toSectionFormat([...this.state.events, ...res]),
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

    showEvent = (item) => {
        this.props.showEvent(item);
    };

    render() {
        return (<EventList
            showEvent={this.showEvent}
            handleRefresh={this.handleRefresh}
            handleLoadMore={this.handleLoadMore}
            {...this.state}
        />)
    }
}

export default connect()(EventListContainer);