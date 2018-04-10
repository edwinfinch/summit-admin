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

import React from 'react'
import { connect } from 'react-redux';
import T from "i18n-react/dist/i18n-react";
import { Breadcrumb } from 'react-breadcrumbs';
import RoomForm from '../../components/forms/room-form';
import { getSummitById }  from '../../actions/summit-actions';
import { getRoom, resetRoomForm, saveRoom } from "../../actions/location-actions";

class EditRoomPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            roomId: props.match.params.room_id
        }
    }

    componentWillReceiveProps(nextProps) {
        let {roomId} = this.state;
        let {currentLocation} = nextProps;

        let new_room_id = nextProps.match.params.room_id;

        if(roomId != new_room_id) {

            this.setState({
                roomId: new_room_id
            });

            if(new_room_id) {
                this.props.getRoom(currentLocation.id, new_room_id);
            } else {
                this.props.resetRoomForm();
            }
        }
    }

    componentWillMount () {
        let {currentLocation, allFloors} = this.props;

        if(allFloors.length == 0){
            this.props.getLocation(currentLocation.id);
        }
    }

    componentDidMount () {
        let {currentSummit, currentLocation, errors} = this.props;
        let roomId = this.props.match.params.room_id;

        if(currentSummit != null) {
            if (roomId != null && currentLocation != null) {
                this.props.getRoom(currentLocation.id, roomId);
            } else {
                this.props.resetRoomForm();
            }
        }
    }

    render(){
        let {currentSummit, currentLocation, entity, errors, allFloors, match} = this.props;
        let title = (entity.id) ? T.translate("general.edit") : T.translate("general.add");
        let breadcrumb = (entity.id) ? entity.name : T.translate("general.new");

        return(
            <div className="container">
                <Breadcrumb data={{ title: breadcrumb, pathname: match.url }} ></Breadcrumb>
                <h3>{title} {T.translate("edit_room.room")}</h3>
                <hr/>
                {currentSummit &&
                <RoomForm
                    history={this.props.history}
                    currentSummit={currentSummit}
                    locationId={currentLocation.id}
                    allFloors={allFloors}
                    entity={entity}
                    errors={errors}
                    onSubmit={this.props.saveRoom}
                />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentRoomState, currentLocationState }) => ({
    currentSummit : currentSummitState.currentSummit,
    currentLocation : currentLocationState.entity,
    allFloors: currentLocationState.entity.floors,
    ...currentRoomState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getRoom,
        resetRoomForm,
        saveRoom,
    }
)(EditRoomPage);