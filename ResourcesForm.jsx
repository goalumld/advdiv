import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Row, Col } from 'react-bootstrap';
import ResourcesValidationSchema from '../../schema/ResourcesValidationSchema';
import debug from 'sabio-debug';
import * as resourceService from '../../services/resourceService';
import locationService from '../../services/locationService';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

function ResourcesForm() {
    const _logger = debug.extend('ResourcesForm');

    const [resourcesData, setResourceData] = useState({
        formData: {
            id: '',
            name: '',
            headline: '',
            description: '',
            logo: '',
            locationId: '',
            contactName: '',
            contactEmail: '',
            phone: '',
            siteUrl: '',
            createdBy: 1,
        },
        locations: [],
    });

    const { state } = useLocation();
    const { id } = useParams();
    const [resourceId, setResourceId] = useState({ id: '' });

    useEffect(() => {
        _logger('UseEffect Firing');

        setResourceId(id);
        if (state) {
            setResourceData((prevState) => {
                let rd = { ...prevState };

                rd.formData.id = id;
                rd.formData.name = state.payload.name;
                rd.formData.headline = state.payload.headline;
                rd.formData.description = state.payload.description;
                rd.formData.logo = state.payload.logo;
                rd.formData.locationId = state.payload.locationId;
                rd.formData.contactName = state.payload.contactName;
                rd.formData.contactEmail = state.payload.contactEmail;
                rd.formData.phone = state.payload.phone;
                rd.formData.siteUrl = state.payload.siteUrl;
                rd.formData.createdBy = state.payload.createdBy;

                return rd;
            });
        }
        locationService.getPagesLocations(0, 50).then(getPagesLocationSuccess).catch(getPagesLocationError);
    }, []);

    const getPagesLocationSuccess = (data) => {
        _logger(data.data.item.pagedItems);
        let returnedArray = data.data.item.pagedItems;

        setResourceData((prevState) => {
            const ld = { ...prevState };
            ld.locations = returnedArray;
            return ld;
        });
    };

    const mapLocation = (location) => {
        return (
            <option value={location.id} key={`locationId_${location.id}`}>
                {location.lineOne} {location.lineTwo} {location.city} {location.state}
            </option>
        );
    };

    const getPagesLocationError = (error) => {
        _logger(error, 'getLocation Error');
    };

    const submitForm = (values) => {
        _logger('Submitting Form');
        _logger('submit form values', values);
        _logger(resourceId, 'Id being passed');
        if (resourceId === undefined) {
            _logger('id not detected, adding new resource');
            resourceService.addResources(values).then(onAddResourceSuccess).catch(onAddResourceError);
        } else {
            _logger('id detected, updating resource');
            resourceService
                .updateResources(resourcesData.formData.id, values)
                .then(onUpdateResourceSuccess)
                .catch(onUpdateResourceError);
        }
    };

    const onAddResourceSuccess = (response) => {
        _logger(response, 'Resource Add Success');
        toastr.success('You have successfully added a resource', 'Resource Added');

        let returnedResponse = response.data.item;
        setResourceData((prevState) => {
            const form = { ...prevState };
            form.formData.id = returnedResponse;
            return form;
        });
    };

    const onAddResourceError = (error) => {
        _logger(error, 'Resource Add Error');
        toastr.error('You were unsuccessful to add a Resource', 'Failed To Add Resource');
    };

    const onUpdateResourceSuccess = (response) => {
        _logger(response, 'Update Resource Success');
        toastr.success('You have successfully updated a Resource', 'Resource Updated');
    };

    const onUpdateResourceError = (error) => {
        _logger(error, 'Update Resource Error');
        toastr.error('You were unsuccessful to update a Resource', 'Failed To Update Resource');
    };

    return (
        <Row className="m-3">
            <Col>
                <div className="container-fluid">
                    <div className="card p-3">
                        <Formik
                            enableReinitialize={true}
                            initialValues={resourcesData.formData}
                            onSubmit={submitForm}
                            validationSchema={ResourcesValidationSchema}>
                            {(props) => {
                                const { values, handleChange } = props;
                                return (
                                    <Form>
                                        <div>
                                            <h3>Add/Update Resource</h3>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={values.name}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="headline">Headline</label>
                                            <Field
                                                type="text"
                                                name="headline"
                                                className="form-control"
                                                value={values.headline}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="headline" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <Field
                                                type="text"
                                                name="description"
                                                className="form-control"
                                                value={values.description}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="description" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="logo">Logo Url</label>
                                            <Field
                                                type="text"
                                                name="logo"
                                                className="form-control"
                                                value={values.logo}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="logo" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="locationId">Location</label>
                                            <Field component="select" name="locationId" className="form-control">
                                                <option value="">Select a Location</option>
                                                {resourcesData.locations.map(mapLocation)}
                                            </Field>
                                            <ErrorMessage name="locationId" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="contactName">Contact Name</label>
                                            <Field
                                                type="text"
                                                name="contactName"
                                                className="form-control"
                                                value={values.contactName}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="contactName" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="contactEmail">Contact Email</label>
                                            <Field
                                                type="email"
                                                name="contactEmail"
                                                className="form-control"
                                                value={values.contactEmail}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="contactEmail" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <Field
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                value={values.phone}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="phone" component="div" className="text-danger" />
                                        </div>
                                        <br />
                                        <div className="form-group">
                                            <label htmlFor="siteUrl">Site Url</label>
                                            <Field
                                                type="text"
                                                name="siteUrl"
                                                className="form-control"
                                                value={values.siteUrl}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="siteUrl" component="div" className="text-danger" />
                                        </div>
                                        <div className="btn text-center col-md-12">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

ResourcesForm.propTypes = {
    values: PropTypes.shape({
        name: PropTypes.string.isRequired,
        headline: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        locationId: PropTypes.number.isRequired,
        contactName: PropTypes.string.isRequired,
        contactEmail: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        siteUrl: PropTypes.string.isRequired,
    }),
    handleChange: PropTypes.func,
    func: PropTypes.func,
};

export default ResourcesForm;
