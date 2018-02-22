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
import { connect } from 'react-redux';
import T from "i18n-react/dist/i18n-react";
import EventTypeForm from '../../components/forms/event-type-form';
import { getSummitById }  from '../../actions/summit-actions';
import { getEventType, resetEventTypeForm, saveEventType } from "../../actions/event-type-actions";
import '../../styles/edit-event-type-page.less';

class EditEventTypePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventTypeId: props.match.params.event_type_id
        }
    }

    componentWillReceiveProps(nextProps) {
        let {eventTypeId} = this.state;

        let new_event_type_id = nextProps.match.params.event_type_id;

        if(eventTypeId != new_event_type_id) {

            this.setState({eventTypeId: new_event_type_id});

            if(new_event_type_id) {
                this.props.getEventType(new_event_type_id);
            } else {
                this.props.resetEventTypeForm();
            }
        }
    }

    componentWillMount () {
        let summitId = this.props.match.params.summit_id;
        let {currentSummit} = this.props;

        if(currentSummit == null){
            this.props.getSummitById(summitId);
        }
    }

    componentDidMount () {
        let {currentSummit, allTypes, errors} = this.props;
        let eventTypeId = this.props.match.params.event_type_id;

        if(currentSummit != null) {
            if (eventTypeId != null) {
                this.props.getEventType(eventTypeId);
            } else {
                this.props.resetEventTypeForm();
            }
        }
    }

    render(){
        let {currentSummit, entity, errors} = this.props;
        let title = (entity.id) ? T.translate("general.edit") : T.translate("general.add");

        return(
            <div className="container">
                <h3>{title} {T.translate("edit_event_type.event_type")}</h3>
                <hr/>
                {currentSummit &&
                <EventTypeForm
                    history={this.props.history}
                    currentSummit={currentSummit}
                    entity={entity}
                    errors={errors}
                    onSubmit={this.props.saveEventType}
                />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentEventTypeState }) => ({
    currentSummit : currentSummitState.currentSummit,
    ...currentEventTypeState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getEventType,
        resetEventTypeForm,
        saveEventType,
    }
)(EditEventTypePage);