import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';

import debug from 'sabio-debug';
const _logger = debug.extend('locations');
const _loggerMap = _logger.extend('Map');

const api = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
_logger(api, 'gmap api');

function Map({ coordinates }) {
    const [marker, setMarker] = useState({
        position: {
            lat: 34.082741,
            lng: -118.316993,
        },
    });

    useEffect(() => {
        setMarker((prevState) => {
            let newMarker = { ...prevState };
            newMarker.position = { lat: coordinates.lat, lng: coordinates.lng };
            _loggerMap(newMarker);
            return newMarker;
        });
    }, [coordinates]);

    return (
        <LoadScript googleMapsApiKey={api} libraries={['places']}>
            <GoogleMap zoom={10} center={marker.position} mapContainerStyle={{ width: '100%', height: '500px' }}>
                <Marker position={marker.position}></Marker>
            </GoogleMap>
        </LoadScript>
    );
}

export default Map;

Map.propTypes = {
    coordinates: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
};
