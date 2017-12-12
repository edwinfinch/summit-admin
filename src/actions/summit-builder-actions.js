import {createAction, getRequest, putRequest, startLoading, stopLoading, deleteRequest } from "openstack-uicore-foundation";
import moment from "moment-timezone";
import SummitEvent from "../models/summit-event";
import { authErrorHandler, apiBaseUrl } from './base-actions';
import { ScheduleEventsSearchResultMaxPage } from '../constants';

export const REQUEST_UNSCHEDULE_EVENTS_PAGE               = 'REQUEST_UNSCHEDULE_EVENTS_PAGE';
export const RECEIVE_UNSCHEDULE_EVENTS_PAGE               = 'RECEIVE_UNSCHEDULE_EVENTS_PAGE';
export const REQUEST_SCHEDULE_EVENTS_PAGE                 = 'REQUEST_SCHEDULE_EVENTS_PAGE';
export const RECEIVE_SCHEDULE_EVENTS_PAGE                 = 'RECEIVE_SCHEDULE_EVENTS_PAGE';
export const REQUEST_PUBLISH_EVENT                        = 'REQUEST_PUBLISH_EVENT';
export const CHANGE_CURRENT_DAY                           = 'CHANGE_CURRENT_DAY';
export const CHANGE_CURRENT_LOCATION                      = 'CHANGE_CURRENT_LOCATION';
export const CHANGE_CURRENT_EVENT_TYPE                    = 'CHANGE_CURRENT_EVENT_TYPE';
export const CHANGE_CURRENT_TRACK                         = 'CHANGE_CURRENT_TRACK';
export const CHANGE_CURRENT_PRESENTATION_SELECTION_STATUS = 'CHANGE_CURRENT_PRESENTATION_SELECTION_STATUS';
export const CHANGE_CURRENT_UNSCHEDULE_SEARCH_TERM        = 'CHANGE_CURRENT_UNSCHEDULE_SEARCH_TERM';
export const CHANGE_CURRENT_SCHEDULE_SEARCH_TERM          = 'CHANGE_CURRENT_SCHEDULE_SEARCH_TERM';
export const CHANGE_CURRENT_ORDER_BY                      = 'CHANGE_CURRENT_ORDER_BY';
export const UNPUBLISHED_EVENT                            = 'UNPUBLISHED_EVENT';
export const RECEIVE_SCHEDULE_EVENTS_SEARCH_PAGE          = 'RECEIVE_SCHEDULE_EVENTS_SEARCH_PAGE';
export const RECEIVE_EMPTY_SPOTS                          = 'RECEIVE_EMPTY_SPOTS';

export const getUnScheduleEventsPage =
    (
        summitId,
        page             = 1,
        per_page         = 10,
        event_type_id    = null,
        track_id         = null,
        selection_status = null,
        term             = null,
        order            = null
    ) =>
    (dispatch, getState) => {
        let { loggedUserState } = getState();
        let { accessToken }     = loggedUserState;
        dispatch(startLoading());
        // filters
        let filter = [];

        if(event_type_id != null){
            filter.push(`event_type_id==${event_type_id}`);
        }

        if(track_id != null){
            filter.push(`track_id==${track_id}`);
        }

        if(selection_status != null){
            filter.push(`selection_status==${selection_status}`);
        }

        if(term != null){
            filter.push(`title=@${term},abstract=@${term},social_summary=@${term},tags=@${term},speaker=@${term},speaker_email=@${term}`);
        }

        let params = {
            page         : page,
            per_page     : per_page,
            access_token : accessToken,
        };

        if(filter.length > 0){
            params['filter[]']= filter;
        }

        // order

        if(order != null){
            params['order']= `+${order}`;
        }

        return getRequest(
            createAction(REQUEST_UNSCHEDULE_EVENTS_PAGE),
            createAction(RECEIVE_UNSCHEDULE_EVENTS_PAGE),
            `${apiBaseUrl}/api/v1/summits/${summitId}/events/unpublished`,
            authErrorHandler
        )(params)(dispatch).then(() => {
                dispatch(stopLoading());
            }
        );
    };

export const publishEvent = (event, day, startTime, minutes) =>
    (dispatch, getState) => {

        let { loggedUserState, currentSummitState, currentScheduleBuilderState } = getState();
        let { accessToken }     = loggedUserState;
        let { currentSummit }   = currentSummitState;
        let { currentLocation } = currentScheduleBuilderState;

        let eventModel          = new SummitEvent(event, currentSummit);
        let [eventStarDateTime, eventEndDateTime ] = eventModel.calculateNewDates(day, startTime, minutes);

        dispatch(startLoading());
        putRequest(
            null,
            createAction(REQUEST_PUBLISH_EVENT)(
                {
                    currentSummit,
                    currentLocation,
                    event,
                    day,
                    startTime,
                    minutes,
                }
            ),
            `${apiBaseUrl}/api/v1/summits/${currentSummit.id}/events/${event.id}/publish?access_token=${accessToken}`,
            {
                location_id : currentLocation.id,
                start_date  : eventStarDateTime.valueOf()/1000,
                end_date    : eventEndDateTime.valueOf()/1000,
            },
            authErrorHandler
        )({})(dispatch)
            .then(
            () => {
                dispatch(stopLoading())
            }
        );

}

export const changeCurrentSelectedDay = (currentSelectedDay) => (dispatch, getState) => {
    dispatch(createAction(CHANGE_CURRENT_DAY)(
        {
            day: currentSelectedDay
        }
    ));
}

export const changeCurrentSelectedLocation = (currentSelectedLocation) => (dispatch, getState) => {
    dispatch(createAction(CHANGE_CURRENT_LOCATION)(
        {
            location: currentSelectedLocation
        }
    ));
}

export const getPublishedEventsBySummitDayLocation = (currentSummit, currentDay, currentLocation) => (dispatch, getState) => {
    let { loggedUserState } = getState();
    let { accessToken }     = loggedUserState;
    currentDay              = moment(currentDay, 'YYYY-MM-DD').tz(currentSummit.time_zone.name);
    let startDate           = ( currentDay.clone().hours(0).minutes(0).seconds(0).valueOf()) / 1000;
    let endDate             = ( currentDay.clone().hours(23).minutes(59).seconds(59).valueOf()) /1000;

    dispatch(startLoading());
    let locationId = currentLocation.id == 0 ? 'tbd': currentLocation.id;
    return getRequest(
        createAction(REQUEST_SCHEDULE_EVENTS_PAGE),
        createAction(RECEIVE_SCHEDULE_EVENTS_PAGE),
        `${apiBaseUrl}/api/v1/summits/${currentSummit.id}/locations/${locationId}/events/published?access_token=${accessToken}&filter[]=start_date>=${startDate}&filter[]=end_date<=${endDate}`,
        authErrorHandler
    )({})(dispatch)
        .then(() =>
            dispatch(stopLoading())
        );
}

export const changeCurrentEventType = (currentEventType) => (dispatch, getState) => {

    dispatch(createAction(CHANGE_CURRENT_EVENT_TYPE)(
        {
            eventType: currentEventType
        }
    ));
}

export const changeCurrentTrack = (currentTrack) => (dispatch, getState) => {

    dispatch(createAction(CHANGE_CURRENT_TRACK)(
        {
            track: currentTrack
        }
    ));
}

export const changeCurrentPresentationSelectionStatus = (currentPresentationSelectionStatus) => (dispatch, getState) => {

    dispatch(createAction(CHANGE_CURRENT_PRESENTATION_SELECTION_STATUS)(
        {
            presentationSelectionStatus: currentPresentationSelectionStatus
        }
    ));
}

export const changeCurrentUnScheduleOrderBy = (orderBy) => (dispatch, getState) => {

    dispatch(createAction(CHANGE_CURRENT_ORDER_BY)(
        {
            orderBy: orderBy
        }
    ));
}


export const changeCurrentUnscheduleSearchTerm = (term) => (dispatch, getState) => {

    dispatch(createAction(CHANGE_CURRENT_UNSCHEDULE_SEARCH_TERM)(
        {
            term
        }
    ));
}

export const changeCurrentScheduleSearchTerm = (term) => (dispatch, getState) => {

    dispatch(createAction(CHANGE_CURRENT_SCHEDULE_SEARCH_TERM)(
        {
            term
        }
    ));
}

export const unPublishEvent = (event) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());
    deleteRequest(
        null,
        createAction(UNPUBLISHED_EVENT)(
            {
                event
            }
        ),
        `${apiBaseUrl}/api/v1/summits/${currentSummit.id}/events/${event.id}/publish?access_token=${accessToken}`,
        {},
        authErrorHandler
    )({})(dispatch)
        .then(
            () => {
                dispatch(stopLoading())
            }
        );

}

export const searchScheduleEvents = (term) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        page         : 1,
        per_page     : ScheduleEventsSearchResultMaxPage,
        access_token : accessToken,
        filter: `title=@${term},abstract=@${term},social_summary=@${term},tags=@${term},speaker=@${term},speaker_email=@${term}`,
        order:'title+,id+'
    };

    return getRequest(
        null,
        createAction(RECEIVE_SCHEDULE_EVENTS_SEARCH_PAGE),
        `${apiBaseUrl}/api/v1/summits/${currentSummit.id}/events/published`,
        authErrorHandler
    )(params)(dispatch)
        .then(() =>
            dispatch(stopLoading())
        );
}

export const getEmptySpots = (location, fromDate, toDate, gapSize) => (dispatch, getState) => {
    let { loggedUserState, currentSummitState } = getState();
    let { accessToken }     = loggedUserState;
    let { currentSummit }   = currentSummitState;

    dispatch(startLoading());

    let params = {
        access_token : accessToken,
        'filter[]': [
            `location_id==${location.id}`,
            `start_date>=${fromDate}`,
            `end_date<=${toDate}`,
            `gap<=${gapSize}`,
        ]
    };

    return getRequest(
        null,
        createAction(RECEIVE_EMPTY_SPOTS),
        `${apiBaseUrl}/api/v1/summits/${currentSummit.id}/events/published/empty-spots`,
        authErrorHandler
    )(params)(dispatch)
        .then(() =>
            dispatch(stopLoading())
        );
}