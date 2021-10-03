import React from 'react';

import EventDetail from '../modules/events/EventDetail';

const EventDetailScreen = ({ route }) => <EventDetail item={route.params.item} />;

export default EventDetailScreen;
