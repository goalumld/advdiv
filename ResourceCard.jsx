import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import Swal from 'sweetalert2';
import GoogleMap from './GoogleMaps';

function ResourceCard(props) {
    const [modalShow, setModalShow] = useState(false);

    const _logger = debug.extend('ResourceCard');

    const aResource = props.resource;

    _logger(aResource);

    const navigate = useNavigate();

    const onEditButtonClicked = () => {
        const resourceObj = aResource;
        navigateToFriendForm(resourceObj);
    };

    const navigateToFriendForm = (receivedResourceObj) => {
        const resourceObjToSend = { type: 'EDIT_VIEW', payload: receivedResourceObj };
        navigate(`/resources/${receivedResourceObj.id}`, {
            state: resourceObjToSend,
        });
    };

    const onDeleteButtonClicked = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                props.onResourceClicked(props.resource);
                Swal.fire('Deleted', '', 'success');
            } else {
                return;
            }
        });
    };

    const optionsWithClonOnOverlayclick = {
        closeOnOverlayClick: true,
    };

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
            <div className="card">
                <div className="card-body" style={{ color: `slategray` }}>
                    <h4 className="card-title text-center">{aResource.name}</h4>
                    <img className="card-img-top p-3" src={aResource.logo} alt=""></img>
                    <div className="container">
                        <div className="text-center">
                            <button className="btn" onClick={onEditButtonClicked}>
                                <img
                                    src="https://icon-library.com/images/edit-icon-vector/edit-icon-vector-21.jpg"
                                    alt=""
                                    width="18"
                                />
                            </button>
                            &nbsp;
                            <button
                                className="btn"
                                onClick={() => onDeleteButtonClicked(optionsWithClonOnOverlayclick)}>
                                <img src="https://www.svgrepo.com/show/21045/delete-button.svg" alt="" width="20"></img>
                            </button>
                            &nbsp;
                            <button className="btn" onClick={() => setModalShow(true)}>
                                <img src="https://cdn-icons-png.flaticon.com/512/61/61093.png" alt="" width="20"></img>
                            </button>
                            <MoreInfoClicked show={modalShow} onHide={() => setModalShow(false)} />
                        </div>
                    </div>
                </div>
            </div>
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
