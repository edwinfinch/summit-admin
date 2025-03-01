/**
 * Copyright 2017 OpenStack Foundation
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
import {
    INIT_SPEAKERS_LIST_PARAMS,
    REQUEST_SPEAKERS_BY_SUMMIT,
    RECEIVE_SPEAKERS_BY_SUMMIT,
    SELECT_SUMMIT_SPEAKER,
    UNSELECT_SUMMIT_SPEAKER,
    SELECT_ALL_SUMMIT_SPEAKERS,
    UNSELECT_ALL_SUMMIT_SPEAKERS,
    SEND_SPEAKERS_EMAILS,
    SET_SPEAKERS_CURRENT_FLOW_EVENT
} from '../../actions/speaker-actions';

import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/security/actions';
import {REQUEST_SUMMIT, SET_CURRENT_SUMMIT} from "../../actions/summit-actions";
import {buildSpeakersSubmittersList} from "../utils/methods";

const DEFAULT_STATE = {
    items: [],
    term: null,
    order: 'full_name',
    orderDir: 1,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    totalItems: 0,
    selectedItems: [],
    selectedAll: false,
    selectionPlanFilter: [],
    trackFilter: [],
    activityTypeFilter: [],
    selectionStatusFilter: [],
    currentFlowEvent: '',
    currentSummitId: null
};

const summitSpeakersListReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action
    switch (type) {
        case LOGOUT_USER:
        case REQUEST_SUMMIT:
        case SET_CURRENT_SUMMIT:
        case INIT_SPEAKERS_LIST_PARAMS:
        {
            return DEFAULT_STATE;
        }
        case REQUEST_SPEAKERS_BY_SUMMIT: {
            let { order, orderDir, term, page, perPage, ...rest } = payload;
            return { ...state, order, orderDir, term, currentPage: page, perPage, ...rest }
        }
        case RECEIVE_SPEAKERS_BY_SUMMIT: {
            let { current_page, total, last_page } = payload.response;

            return {
                ...state,
                items: buildSpeakersSubmittersList(state, payload.response.data),
                currentPage: current_page,
                totalItems: total,
                lastPage: last_page,
            };
        }
        case SELECT_SUMMIT_SPEAKER: {
            return { ...state, selectedItems: [...state.selectedItems, payload], selectedAll: false }
        }
        case UNSELECT_SUMMIT_SPEAKER: {
            return { ...state, selectedItems: state.selectedItems.filter(e => e !== payload), selectedAll: false }
        }
        case SELECT_ALL_SUMMIT_SPEAKERS: {
            return { ...state, selectedAll: true, selectedItems:[] }
        }
        case UNSELECT_ALL_SUMMIT_SPEAKERS: {
            return { ...state, selectedAll: false, selectedItems:[]  }
        }
        case SEND_SPEAKERS_EMAILS: {
            return {
                ...state,
                selectedItems: [],
                currentFlowEvent: '',
                selectedAll: false
            }
        }
        case SET_SPEAKERS_CURRENT_FLOW_EVENT: {
            return { ...state, currentFlowEvent: payload };
        }
        default:
            return state;
    }
};

export default summitSpeakersListReducer;
