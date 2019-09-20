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

import
{
    RECEIVE_PURCHASE_ORDER,
    RESET_PURCHASE_ORDER_FORM
} from '../../actions/order-actions';


import { LOGOUT_USER, VALIDATE } from 'openstack-uicore-foundation/lib/actions';
import {SET_CURRENT_SUMMIT} from "../../actions/summit-actions";

export const DEFAULT_ENTITY = {
    id: 0,
    number: '',
    owner_company: '',
    owner_company_id: 0,
    owner_email: '',
    owner_first_name: '',
    owner_id: 0,
    owner_surname: '',
    payment_method: '',
    status: '',
    extra_question_answers: [],
    tickets: []
}

const DEFAULT_STATE = {
    entity: DEFAULT_ENTITY,
    errors: {}
};

const purchaseOrderReducer = (state = DEFAULT_STATE, action) => {
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
        case RESET_PURCHASE_ORDER_FORM: {
            return {...state,  entity: {...DEFAULT_ENTITY}, errors: {} };
        }
        break;
        case RECEIVE_PURCHASE_ORDER: {
            let entity = {...payload.response};


            for(var key in entity) {
                if(entity.hasOwnProperty(key)) {
                    entity[key] = (entity[key] == null) ? '' : entity[key] ;
                }
            }

            entity.tickets = entity.tickets.map(t => {
                let owner_full_name = 'N/A';
                let owner_email = 'N/A';

                if (t.owner) {
                    owner_email = t.owner.email;

                    if (t.owner.member) {
                        owner_full_name = `${t.owner.member.first_name} ${t.owner.member.last_name}`;
                    } else if (t.owner.first_name && t.owner.surname) {
                        owner_full_name = `${t.owner.first_name} ${t.owner.surname}`;
                    }
                }

                return ({...t, ticket_type_name: t.ticket_type.name, owner_full_name, owner_email})
            });

            return {...state,  entity: {...entity}, errors: {} };
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

export default purchaseOrderReducer;
