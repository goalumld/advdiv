import React, { useState, useEffect, useCallback } from 'react';
import ResourceCard from './ResourceCard';
import * as resourceService from '../../services/resourceService';
import debug from 'sabio-debug';
import { Link } from 'react-router-dom';
import ResourceForm from './ResourcesForm';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';

function Resources() {
    const _logger = debug.extend('Resources');

    const [pageData, setPageData] = useState({
        arrayOfResources: [],
        resourceComponents: [],
    });

    const [pageIndex, updatePageIndex] = useState(0);
    const [pageSize] = useState(8);
    const [totalPages, updateTotalPages] = useState(0);
    const [currentActualPage, updateCurrentActualPage] = useState(1);

    const onChange = (e) => {
        _logger('onChange Firing', { syntheticEvent: e });
        let target = e;
        if (target > 0) {
            target--;
        }
        updatePageIndex(() => {
            const currentPageIndex = target;
            return currentPageIndex;
        });
        updateCurrentActualPage(() => {
            const paginatePage = e;
            return paginatePage;
        });

        resourceService
            .getPaginatedResources(target, pageSize)
            .then(getPaginatedResourcesSuccess)
            .catch(getPaginatedResourcesError);
    };

    useEffect(() => {
        resourceService
            .getPaginatedResources(pageIndex, pageSize)
            .then(getPaginatedResourcesSuccess)
            .catch(getPaginatedResourcesError);
    }, []);

    const getPaginatedResourcesSuccess = (data) => {
        let returnedArray = data.item.pagedItems;

        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.arrayOfResources = returnedArray;
            pd.resourceComponents = returnedArray.map(mapResource);
            updateTotalPages(() => {
                return data.item.totalCount;
            });
            return pd;
        });
    };

    const getPaginatedResourcesError = (error) => {
        _logger(error, 'getPaginatedResources Error');
    };

    const mapResource = (aResource) => {
        return <ResourceCard resource={aResource} key={aResource.id} onResourceClicked={onDeleteRequested} />;
    };

    const onDeleteRequested = useCallback((myResource, eObj) => {
        _logger(myResource.id, { myResource, eObj });

        const handler = getDeleteSuccessHandler(myResource.id);

        resourceService.deleteResources(myResource.id).then(handler).catch(onDeleteError);
    }, []);

    const getDeleteSuccessHandler = (idToBeDeleted) => {
        return () => {
            setPageData((prevState) => {
                const pd = { ...prevState };
                pd.arrayOfResources = [...pd.arrayOfResources];

                const indOf = pd.arrayOfResources.findIndex((person) => {
                    let result = false;

                    if (person.id === idToBeDeleted) {
                        result = true;
                    }

                    return result;
                });

                if (indOf >= 0) {
                    pd.arrayOfResources.splice(indOf, 1);
                    pd.resourceComponents = pd.arrayOfResources.map(mapResource);
                }

                return pd;
            });
        };
    };

    const onDeleteError = (error) => {
        _logger(error);
    };

    return (
        <div className="m-3">
            <div className="card container">
                <div className="container">
                    <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        Resources (Admin)
                    </h2>
                    <div
                        className="container"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link
                            to="/resources/new"
                            element={<ResourceForm></ResourceForm>}
                            className="btn btn-primary"
                            style={{ margin: `5px` }}>
                            Add
                        </Link>
                        <Pagination
                            current={currentActualPage}
                            total={totalPages}
                            pageSize={pageSize}
                            onChange={onChange}
                            locale={locale}></Pagination>
                    </div>
                    <div className="container">
                        <div className="row" style={{ padding: `10px` }}>
                            {pageData.resourceComponents}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Resources;
