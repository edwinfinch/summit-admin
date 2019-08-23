/**
 * Copyright 2018 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import T from "i18n-react/dist/i18n-react";
import history from '../history'
import {
    getRequest,
    putRequest,
    postRequest,
    deleteRequest,
    createAction,
    stopLoading,
    startLoading,
    showMessage,
    showSuccessMessage,
    authErrorHandler
} from 'openstack-uicore-foundation/lib/methods';

export const REQUEST_SPONSORS       = 'REQUEST_SPONSORS';
export const RECEIVE_SPONSORS       = 'RECEIVE_SPONSORS';
export const RECEIVE_SPONSOR        = 'RECEIVE_SPONSOR';
export const RESET_SPONSOR_FORM     = 'RESET_SPONSOR_FORM';
export const UPDATE_SPONSOR         = 'UPDATE_SPONSOR';
export const SPONSOR_UPDATED        = 'SPONSOR_UPDATED';
export const SPONSOR_ADDED          = 'SPONSOR_ADDED';
export const SPONSOR_DELETED        = 'SPONSOR_DELETED';

export const REQUEST_SPONSORSHIPS       = 'REQUEST_SPONSORSHIPS';
export const RECEIVE_SPONSORSHIPS       = 'RECEIVE_SPONSORSHIPS';
export const RECEIVE_SPONSORSHIP        = 'RECEIVE_SPONSORSHIP';
export const RESET_SPONSORSHIP_FORM     = 'RESET_SPONSORSHIP_FORM';
export const UPDATE_SPONSORSHIP         = 'UPDATE_SPONSORSHIP';
export const SPONSORSHIP_UPDATED        = 'SPONSORSHIP_UPDATED';
export const SPONSORSHIP_ADDED          = 'SPONSORSHIP_ADDED';
export const SPONSORSHIP_DELETED        = 'SPONSORSHIP_DELETED';




/******************  SPONSORS ****************************************/


export const getSponsors = ( term = null, page = 1, perPage = 10, order = 'order', orderDir = 1 ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;
    let filter = [];

    dispatch(startLoading());

    if(term){
        filter.push(`'company_name'=@${term},'sponsorship_name'=@${term},'sponsorship_size'=@${term}`);
    }

    let params = {
        page         : page,
        per_page     : perPage,
        expand       : 'company,sponsorship',
        access_token : accessToken,
    };

    if(filter.length > 0){
        params['filter[]']= filter;
    }

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }


    return getRequest(
        createAction(REQUEST_SPONSORS),
        createAction(RECEIVE_SPONSORS),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsors`,
        authErrorHandler,
        {page, perPage, order, orderDir, term}
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getSponsor = (sponsorId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_SPONSOR),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsors/${sponsorId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const resetSponsorForm = () => (dispatch, getState) => {
    dispatch(createAction(RESET_SPONSOR_FORM)({}));
};

export const saveSponsor = (entity) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
    };

    dispatch(startLoading());

    let normalizedEntity = normalizeSponsor(entity);

    if (entity.id) {

        putRequest(
            createAction(UPDATE_SPONSOR),
            createAction(SPONSOR_UPDATED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsors/${entity.id}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showSuccessMessage(T.translate("edit_sponsor.sponsor_saved")));
            });

    } else {
        let success_message = {
            title: T.translate("general.done"),
            html: T.translate("edit_sponsor.sponsor_created"),
            type: 'success'
        };

        postRequest(
            createAction(UPDATE_SPONSOR),
            createAction(SPONSOR_ADDED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsors`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showMessage(
                    success_message,
                    () => { history.push(`/app/summits/${currentSummit.id}/sponsors/${payload.response.id}`) }
                ));
            });
    }
}

export const deleteSponsor = (sponsorId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(SPONSOR_DELETED)({sponsorId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsors/${sponsorId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};


const normalizeSponsor = (entity) => {
    let normalizedEntity = {...entity};

    return normalizedEntity;

}




/******************  SPONSORSHIPS ****************************************/



export const getSponsorships = ( order = 'name', orderDir = 1 ) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        page         : 1,
        per_page     : 100,
        access_token : accessToken,
    };

    // order
    if(order != null && orderDir != null){
        let orderDirSign = (orderDir == 1) ? '+' : '-';
        params['order']= `${orderDirSign}${order}`;
    }


    return getRequest(
        createAction(REQUEST_SPONSORSHIPS),
        createAction(RECEIVE_SPONSORSHIPS),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsorship-types`,
        authErrorHandler,
        {order, orderDir}
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const getSponsorship = (sponsorshipId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
    };

    return getRequest(
        null,
        createAction(RECEIVE_SPONSORSHIP),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsorship-types/${sponsorshipId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};

export const resetSponsorshipForm = () => (dispatch, getState) => {
    dispatch(createAction(RESET_SPONSORSHIP_FORM)({}));
};

export const saveSponsorship = (entity) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken,
    };

    dispatch(startLoading());

    let normalizedEntity = normalizeSponsorship(entity);

    if (entity.id) {

        putRequest(
            createAction(UPDATE_SPONSORSHIP),
            createAction(SPONSORSHIP_UPDATED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsorship-types/${entity.id}`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showSuccessMessage(T.translate("edit_sponsorship.sponsorship_saved")));
            });

    } else {
        let success_message = {
            title: T.translate("general.done"),
            html: T.translate("edit_sponsorship.sponsorship_created"),
            type: 'success'
        };

        postRequest(
            createAction(UPDATE_SPONSORSHIP),
            createAction(SPONSORSHIP_ADDED),
            `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsorship-types`,
            normalizedEntity,
            authErrorHandler,
            entity
        )(params)(dispatch)
            .then((payload) => {
                dispatch(showMessage(
                    success_message,
                    () => { history.push(`/app/summits/${currentSummit.id}/sponsorships/${payload.response.id}`) }
                ));
            });
    }
}

export const deleteSponsorship = (sponsorshipId) => (dispatch, getState) => {

    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    let params = {
        access_token : accessToken
    };

    return deleteRequest(
        null,
        createAction(SPONSORSHIP_DELETED)({sponsorshipId}),
        `${window.API_BASE_URL}/api/v1/summits/${currentSummit.id}/sponsorship-types/${sponsorshipId}`,
        authErrorHandler
    )(params)(dispatch).then(() => {
            dispatch(stopLoading());
        }
    );
};


const normalizeSponsorship = (entity) => {
    let normalizedEntity = {...entity};

    return normalizedEntity;

}