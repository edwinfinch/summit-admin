/**
 * Copyright 2020 OpenStack Foundation
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

import { VALIDATE } from 'openstack-uicore-foundation/lib/utils/actions';
import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/security/actions';
import { SET_CURRENT_SUMMIT } from '../../actions/summit-actions';
import {
    EMAIL_FLOW_EVENT_UPDATED,
    RECEIVE_EMAIL_FLOW_EVENT,
    RESET_EMAIL_FLOW_EVENT_FORM, UPDATE_EMAIL_FLOW_EVENT
} from "../../actions/email-flows-events-actions";

export const DEFAULT_ENTITY = {
    id : 0,
    email_template_identifier : '',
    flow_name : '',
    event_type_name : '',
    summit_id : 0,
};

const DEFAULT_STATE = {
    entity      : DEFAULT_ENTITY,
    errors      : {}
};

const emailFlowEventReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action
    switch (type) {
        case LOGOUT_USER: {
            // we need this in case the token expired while editing the form
            if (payload.hasOwnProperty('persistStore')) {
                return state;
            } else {
                return {...state,  entity: {...DEFAULT_ENTITY}, errors: {} };
            }
        }
            break;
        case SET_CURRENT_SUMMIT:
        case RESET_EMAIL_FLOW_EVENT_FORM: {
            return {...state,  entity: {...DEFAULT_ENTITY}, errors: {} };
        }
            break;
        case UPDATE_EMAIL_FLOW_EVENT: {
            return {...state,  entity: {...payload}, errors: {} };
        }
            break;
        case RECEIVE_EMAIL_FLOW_EVENT: {
            let entity = {...payload.response};

            for(var key in entity) {
                if(entity.hasOwnProperty(key)) {
                    entity[key] = (entity[key] == null) ? '' : entity[key] ;
                }
            }

            return {...state, entity: {...DEFAULT_ENTITY, ...entity} };
        }
            break;
        case EMAIL_FLOW_EVENT_UPDATED: {
            return state;
        }
            break;
        case VALIDATE: {
            return {...state,  errors: payload.errors };
        }
            break;
        default:
            return state;
    }
};

export default emailFlowEventReducer;
