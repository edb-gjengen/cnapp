import {connect} from "react-redux";
import EventList from "./EventList";

import React from 'react';
import moment from "moment";
import 'moment/locale/nb';

/* Ref: https://medium.com/react-native-development/how-to-use-the-flatlist-component-react-native-basics-92c482816fe6 */

class EventListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            events: [],
            eventsSectioned: [],
            page: 1,
            noMorePages: false,
            error: null,
            refreshing: false,
        };
    }

    _formatDate(time) {
        moment.locale('nb');
        return moment(time).format('ll');
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
            noMorePages: false,
        }, () => {
            this.fetchEvents()
        });
    };

    handleLoadMore = () => {
        if(this.state.noMorePages || this.state.loading) {
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
        const url = `https://studentersamfundet.no/wp-json/wp/v2/events?page=${page}&future=1`;
        this.setState({ loading: true });

        fetch(url)
            .then(res => res.json())
            .then(res => {
                if(res.code === 'rest_post_invalid_page_number') {
                    this.setState({
                        noMorePages: true
                    });
                }

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
        return (<EventList showEvent={this.showEvent} {...{...this.state, handleRefresh: this.handleRefresh, handleLoadMore: this.handleLoadMore}} />)
    }
}

export default connect()(EventListContainer);