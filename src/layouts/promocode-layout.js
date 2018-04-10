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

import EditPromocodePage from '../pages/promocodes/edit-promocode-page'
import PromocodeListPage from '../pages/promocodes/promocode-list-page'


import { withRouter } from 'react-router-dom'

class PromocodeLayout extends React.Component {

    render(){
        let { match } = this.props;
        return(
            <div>
                <Breadcrumb data={{ title: 'Promocodes', pathname: match.url }} ></Breadcrumb>

                <Switch>
                    <Route exact path={`${match.url}/new`} component={EditPromocodePage}/>
                    <Route exact path={`${match.url}/:promocode_id`} component={EditPromocodePage}/>
                    <Route component={PromocodeListPage}/>
                </Switch>
            </div>
        );
    }

}

export default withRouter(PromocodeLayout)


