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

import React from 'react'
import { Switch, Route } from 'react-router-dom';
import { Breadcrumb } from 'react-breadcrumbs';

import EditEventCategoryPage from '../pages/events/edit-event-category-page'
import EventCategoryListPage from '../pages/events/event-category-list-page'


import { withRouter } from 'react-router-dom'

class EventCategoryLayout extends React.Component {

    render(){
        let { match } = this.props;
        return(
            <div>
                <Breadcrumb data={{ title: 'Event Categories', pathname: match.url }} ></Breadcrumb>

                <Switch>
                    <Route exact path={`${match.url}/new`} component={EditEventCategoryPage}/>
                    <Route exact path={`${match.url}/:event_category_id`} component={EditEventCategoryPage}/>
                    <Route component={EventCategoryListPage}/>
                </Switch>
            </div>
        );
    }

}

export default withRouter(EventCategoryLayout)

