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
import T from 'i18n-react/dist/i18n-react';
import swal from "sweetalert2";
import { Pagination } from 'react-bootstrap';
import FreeTextSearch from "../components/free-text-search/index";
import ScheduleModal from "../components/schedule-modal/index";
import Table from "../components/table/Table";
import { getSummitById }  from '../actions/summit-actions';
import { getAttendees, deleteAttendee } from "../actions/attendee-actions";

class SummitAttendeeListPage extends React.Component {

    constructor(props) {
        super(props);

        this.handleEdit = this.handleEdit.bind(this);
        this.handleViewSchedule = this.handleViewSchedule.bind(this);
        this.hasSchedule = this.hasSchedule.bind(this);
        this.onCloseSchedule = this.onCloseSchedule.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleNewAttendee = this.handleNewAttendee.bind(this);
        this.handleDeleteAttendee = this.handleDeleteAttendee.bind(this);

        this.state = {
            showModal: false,
            modalTitle: '',
            modalSchedule: []
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
        let {currentSummit} = this.props;
        if(currentSummit != null) {
            this.props.getAttendees();
        }
    }

    handleEdit(attendee_id) {
        let {currentSummit, history} = this.props;
        history.push(`/app/summits/${currentSummit.id}/attendees/${attendee_id}`);
    }

    handleViewSchedule(attendee_id, ev) {
        ev.preventDefault();

        let {attendees} = this.props;
        let attendee = attendees.find(a => a.id == attendee_id);

        this.setState({
            showModal: true,
            modalTitle: attendee.name,
            modalSchedule: attendee.schedule
        });
    }

    hasSchedule(attendee_id) {

        let {attendees} = this.props;
        let attendee = attendees.find(a => a.id == attendee_id);

        return attendee.schedule.length > 0;
    }

    onCloseSchedule() {
        this.setState({showModal: false})
    }

    handlePageChange(page) {
        let {term, order, orderDir, perPage} = this.props;
        this.props.getAttendees(term, page, perPage, order, orderDir);
    }

    handleSort(index, key, dir, func) {
        let {term, page, perPage} = this.props;
        key = (key == 'name') ? 'last_name' : key;
        this.props.getAttendees(term, page, perPage, key, dir);
    }

    handleSearch(term) {
        let {order, orderDir, page, perPage} = this.props;
        this.props.getAttendees(term, page, perPage, order, orderDir);
    }

    handleNewAttendee(ev) {
        let {currentSummit, history} = this.props;
        history.push(`/app/summits/${currentSummit.id}/attendees/new`);
    }

    handleDeleteAttendee(attendeeId, ev) {
        let {deleteAttendee, attendees} = this.props;
        let attendee = attendees.find(a => a.id == attendeeId);

        ev.preventDefault();

        swal({
            title: T.translate("general.are_you_sure"),
            text: T.translate("attendee_list.delete_attendee_warning") + ' ' + attendee.name,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: T.translate("general.yes_delete")
        }).then(function(){
            deleteAttendee(attendeeId);
        }).catch(swal.noop);
    }

    render(){
        let {currentSummit, attendees, lastPage, currentPage, term, order, orderDir, totalAttendees} = this.props;
        let {showModal, modalSchedule, modalTitle} = this.state;

        let columns = [
            { columnKey: 'member_id', value: T.translate("attendee_list.member_id") },
            { columnKey: 'name', value: T.translate("general.name"), sortable: true },
            { columnKey: 'email', value: T.translate("general.email") },
            { columnKey: 'eventbrite_id', value: T.translate("attendee_list.eventbrite_id") },
            { columnKey: 'bought_date', value: T.translate("attendee_list.bought_date") },
            { columnKey: 'summit_hall_checked_in', value: T.translate("attendee_list.summit_hall_checked_in") },
        ];

        let table_options = {
            className: "table table-striped table-bordered table-hover dataTable",
            sortCol: (order == 'last_name') ? 'name' : order,
            sortDir: orderDir,
            actions: {
                edit: {onClick: this.handleEdit},
                delete: { onClick: this.handleDeleteAttendee },
                custom: [
                    {
                        name: 'show_schedule',
                        icon: <i className="fa fa-list"></i>,
                        onClick: this.handleViewSchedule,
                        display: this.hasSchedule
                    }
                ]
            }
        }

        if(currentSummit == null) return null;

        return(
            <div className="container">
                <h3> {T.translate("attendee_list.attendee_list")} ({totalAttendees})</h3>
                <div className={'row'}>
                    <div className={'col-md-6'}>
                        <FreeTextSearch
                            value={term}
                            placeholder={T.translate("attendee_list.placeholders.search_attendees")}
                            onSearch={this.handleSearch}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary" onClick={this.handleNewAttendee}>
                            {T.translate("attendee_list.add_attendee")}
                        </button>
                    </div>
                </div>

                {attendees.length == 0 &&
                <div>{T.translate("attendee_list.no_attendees")}</div>
                }

                {attendees.length > 0 &&
                <div>
                    <Table
                        options={table_options}
                        data={attendees}
                        columns={columns}
                        onSort={this.handleSort}
                        className="dataTable"
                    />
                    <Pagination
                        bsSize="medium"
                        prev
                        next
                        first
                        last
                        ellipsis
                        boundaryLinks
                        maxButtons={10}
                        items={lastPage}
                        activePage={currentPage}
                        onSelect={this.handlePageChange}
                    />
                </div>
                }
                <ScheduleModal
                    show={showModal}
                    title={modalTitle}
                    schedule={modalSchedule}
                    summit={currentSummit}
                    onClose={this.onCloseSchedule}
                />

            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentAttendeeListState }) => ({
    currentSummit   : currentSummitState.currentSummit,
    ...currentAttendeeListState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getAttendees,
        deleteAttendee
    }
)(SummitAttendeeListPage);