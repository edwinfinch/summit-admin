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

import EditSpeakerPage from '../pages/speakers/edit-summit-speaker-page'
import SpeakerListPage from '../pages/speakers/summit-speakers-list-page'
import SpeakerMergePage from '../pages/speakers/merge-speakers-page'


import { withRouter } from 'react-router-dom'

class SpeakerLayout extends React.Component {

    render(){
        let { match } = this.props;
        return(
            <div>
                <Breadcrumb data={{ title: 'Speakers', pathname: match.url }} ></Breadcrumb>

                <Switch>
                    <Route exact path={`${match.url}/new`} component={EditSpeakerPage}/>
                    <Route exact path={`${match.url}/merge`} component={SpeakerMergePage}/>
                    <Route exact path={`${match.url}/:speaker_id`} component={EditSpeakerPage}/>
                    <Route component={SpeakerListPage}/>
                </Switch>
            </div>
        );
    }

}

export default withRouter(SpeakerLayout)


