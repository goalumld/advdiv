import React, { useState, useEffect } from 'react';
import ResourceCard from './ResourceCardPublic';
import * as resourceService from '../../services/resourceService';
import debug from 'sabio-debug';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/lib/locale/en_US';
import toastr from 'toastr';
import 'rc-pagination/assets/index.css';

function Resources() {
    const _logger = debug.extend('Resources');

    const [pageData, setPageData] = useState({
        arrayOfResources: [],
        resourceComponents: [],
        pageIndex: 0,
        pageSize: 8,
        totalPages: 0,
        currentActualPage: 1,
    });

    // const [pageIndex, updatePageIndex] = useState(0);
    // const [pageSize] = useState(8);
    // const [totalPages, updateTotalPages] = useState(0);
    // const [currentActualPage, updateCurrentActualPage] = useState(1);

    const onChange = (e) => {
        _logger('onChange Firing', { syntheticEvent: e });
        let target = e;
        if (target > 0) {
            target--;
        }
        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.pageIndex = target;
            pd.currentActualPage = e;
            return pd;
        });

        resourceService
            .getPaginatedResources(target, pageData.pageSize)
            .then(getPaginatedResourcesSuccess)
            .catch(getPaginatedResourcesError);
    };

    useEffect(() => {
        resourceService
            .getPaginatedResources(pageData.pageIndex, pageData.pageSize)
            .then(getPaginatedResourcesSuccess)
            .catch(getPaginatedResourcesError);
    }, []);

    const getPaginatedResourcesSuccess = (data) => {
        let returnedArray = data.item.pagedItems;

        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.arrayOfResources = returnedArray;
            pd.resourceComponents = returnedArray.map(mapResource);
            pd.totalPages = data.item.totalCount;
            return pd;
        });
    };

    const getPaginatedResourcesError = (error) => {
        _logger(error, 'getPaginatedResources Error');
        toastr.error('Unable to retrieve Resources', 'Failed To Retrieve Resources');
    };

    const mapResource = (aResource) => {
        return <ResourceCard resource={aResource} key={aResource.id} />;
    };

    return (
        <div className="m-3">
            <div className="card container">
                <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Resources</h2>
                <h5 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Welcome to our Resources Library. Here you can view third-party organizations that provide
                    mentorship programs or classes. Click on a card for more details.
                </h5>
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pagination
                        current={pageData.currentActualPage}
                        total={pageData.totalPages}
                        pageSize={pageData.pageSize}
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
    );
}

export default Resources;
