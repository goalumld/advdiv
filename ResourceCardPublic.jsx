import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import GoogleMap from './GoogleMaps';

function ResourceCard(props) {
    const [modalShow, setModalShow] = useState(false);

    const _logger = debug.extend('ResourceCard');

    const aResource = props.resource;

    _logger(aResource);

    const MoreInfoClicked = (props) => {
        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Additional Information</Modal.Title>
                </Modal.Header>
                <div className="container">
                    <GoogleMap
                        coordinates={{
                            lat: aResource.latitude,
                            lng: aResource.longitude,
                        }}></GoogleMap>
                </div>
                <Modal.Body>
                    <div className="container">
                        Description: {aResource.description}
                        <br />
                        Contact Name: {aResource.contactName}
                        <br />
                        Contact Email: {aResource.contactEmail}
                        <br />
                        Phone: {aResource.phone}
                        <br />
                        Website: {aResource.siteUrl}
                        <br />
                        Address: {aResource.lineOne} {aResource.lineTwo} {aResource.city}, {aResource.state}{' '}
                        {aResource.zipCode}
                        <br />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <div className="col-md-3">
            <button className="btn" style={{ boxShadow: 'none', outline: 'none' }} onClick={() => setModalShow(true)}>
                <div className="card">
                    <div className="card-body" style={{ color: `slategray` }}>
                        <h4 className="card-title text-center">{aResource.name}</h4>
                        <img className="card-img-top p-1" src={aResource.logo} alt=""></img>
                        <div className="container">
                            <div className="text-center"></div>
                        </div>
                    </div>
                </div>
            </button>
            <MoreInfoClicked show={modalShow} onHide={() => setModalShow(false)} />
        </div>
    );
}

ResourceCard.propTypes = {
    resource: PropTypes.shape({
        name: PropTypes.string.isRequired,
        headline: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        locationId: PropTypes.number.isRequired,
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zipCode: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        contactName: PropTypes.string.isRequired,
        contactEmail: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        siteUrl: PropTypes.string.isRequired,
    }),
    onResourceClicked: PropTypes.func,
    onHide: PropTypes.func,
};

export default React.memo(ResourceCard);
