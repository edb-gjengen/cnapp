import {connect} from "react-redux";
import React, {Component} from 'react';
import Config from 'react-native-config';

import About from "./About";

class AboutContainer extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         openingHours: '',
    //         loading: false,
    //         error: null,
    //     };
    // }
    //
    // componentDidMount() {
    //     this.fetchOpeningHours();
    // }
    //
    // fetchOpeningHours() {
    //     const url = `${Config.EVENT_API_URL}/wp-json/wp/v2/pages/?slug=aapningstider`;
    //     this.setState({ loading: true });
    //
    //     fetch(url)
    //         .then(res => res.json())
    //         .then(res => {
    //             this.setState({
    //                 openingHours: res ? res[0].content.rendered : '',
    //                 error: res.error || null,
    //                 loading: false,
    //             });
    //
    //         })
    //         .catch(error => {
    //             this.setState({ error, loading: false });
    //         });
    // }

    render() {
        return <About {...this.state} />;
    }
}

export default connect()(AboutContainer);