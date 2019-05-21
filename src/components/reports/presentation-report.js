/**
 * Copyright 2019 OpenStack Foundation
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
import T from 'i18n-react/dist/i18n-react'
import { Pagination } from 'react-bootstrap';
import { Breadcrumb } from 'react-breadcrumbs';
import { Table, FreeTextSearch } from 'openstack-uicore-foundation/lib/components'
import {getReport} from "../../actions/report-actions";
import {connect} from "react-redux";
const Query = require('graphql-query-builder');

const reportName = 'presentation_report';

class PresentationReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: null,
            sortKey: null,
            sortDir: null
        };

        this.buildQuery = this.buildQuery.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleExportReport = this.handleExportReport.bind(this);
    }

    componentWillMount () {
        if (!this.props.currentSummit) return;

        let query = this.buildQuery(1);
        this.props.getReport(query, reportName, 1);
    }

    componentWillReceiveProps (newProps) {
        if (!newProps.currentSummit) return;
        if (this.props.currentSummit.id != newProps.currentSummit.id) {
            this.setState({searchTerm: null});
            let query = this.buildQuery(1);
            this.props.getReport(query, reportName, 1);
        }
    }


    buildQuery(page) {
        let {perPage, currentSummit} = this.props;
        let {searchTerm, sortKey, sortDir} = this.state;
        let filters = {limit: perPage};

        if (page != 1) {
            filters.offset = page * perPage;
        }

        if (sortKey) {
            let order = (sortDir == 1) ? '' : '-';
            filters.sorting = order + '' + sortKey;
        }

        if (searchTerm) {
            filters.search = searchTerm;
        }


        let query = new Query("presentations",{summitId: currentSummit.id});
        let category = new Query("category");
        category.find(["title"]);
        let location = new Query("location");
        location.find(["name"]);
        let member = new Query("member");
        member.find(["id", "firstName", "lastName","email"]);
        let attendances = new Query("attendances", {summitId: currentSummit.id});
        attendances.find(["phoneNumber", "registered", "checkedIn", "confirmed"]);
        let promoCodes = new Query("promoCodes", {summitId: currentSummit.id});
        promoCodes.find(["code", "type"]);
        let speakers = new Query("speakers");
        speakers.find(["id", "firstName", "lastName", {"member": member}, {"attendances": attendances}, {"promoCodes": promoCodes}]);
        let results = new Query("results", filters);
        results.find(["id", "title", "startDate", "published", {"category": category}, {"location": location}, {"speakers": speakers}])

        query.find([{"results": results}, "totalCount"]);

        //console.log(query.toString());

        return query;
    }

    handleSort(index, key, dir, func) {
        let sortKey = null;
        switch(key) {
            case 'track':
                sortKey = 'category__title';
                break;
        }

        this.setState({sortKey: sortKey, sortDir: dir}, () => {
            let query = this.buildQuery(1);
            this.props.getReport(query, reportName, 1);
        });

    }

    handlePageChange(page) {
        let query = this.buildQuery(page);
        this.props.getReport(query, reportName, page);

    }

    handleSearch(term) {
        this.setState({searchTerm: term}, () => {
            let query = this.buildQuery(1);
            this.props.getReport(query, reportName, 1);
        });
    }

    handleExportReport() {
        console.log("export");
    }

    render() {
        let {data, match, currentPage, totalCount, perPage} = this.props;
        let {searchTerm} = this.state;

        let report_columns = [
            { columnKey: 'id', value: 'Id' },
            { columnKey: 'title', value: 'Presentation' },
            { columnKey: 'published', value: 'Published' },
            { columnKey: 'track', value: 'Track', sortable: true },
            { columnKey: 'start_date', value: 'Start Date' },
            { columnKey: 'location', value: 'Location' },
            { columnKey: 'speaker_id', value: 'Speaker Id' },
            { columnKey: 'member_id', value: 'Member Id' },
            { columnKey: 'speaker', value: 'Speaker' },
            { columnKey: 'email', value: 'Email' },
            { columnKey: 'phone', value: 'Phone' },
            { columnKey: 'code', value: 'Promo Code' },
            { columnKey: 'code_type', value: 'Code Type' },
            { columnKey: 'confirmed', value: 'Confirmed' },
            { columnKey: 'registered', value: 'Registered' },
            { columnKey: 'checked_in', value: 'Checked In' },
        ];

        let report_options = { actions: {} }
        let lastPage = Math.floor(totalCount / perPage);


        let reportData = data.map(it => {
            return ({
                id: it.id,
                title: it.title,
                published: it.published,
                track: it.category.title,
                start_date: it.startDate,
                location: it.location.name,
                speaker_id: it.speakers.id,
                member_id: it.speakers.member.id,
                speaker: it.speakers.firstName + ' ' + it.speakers.lastName,
                email: it.speakers.member.email,
                phone: it.speakers.attendances.phoneNumber,
                code: it.speakers.promoCodes.code,
                code_type: it.speakers.promoCodes.type,
                confirmed: it.speakers.attendances.confirmed,
                registered: it.speakers.attendances.registered,
                checked_in: it.speakers.attendances.checkedIn,
            });
        });

        return (
            <div className="container">
                <Breadcrumb data={{ title: T.translate(`reports.${reportName}`), pathname: match.url }} ></Breadcrumb>
                <div className="row">
                    <div className="col-md-8">
                        <h3>{T.translate(`reports.${reportName}`)}</h3>
                    </div>

                </div>
                <hr/>
                <div className={'row'}>
                    <div className={'col-md-6'}>
                        <FreeTextSearch
                            value={searchTerm}
                            placeholder={T.translate("reports.placeholders.search")}
                            onSearch={this.handleSearch}
                        />
                    </div>
                    <div className="col-md-6 text-right">
                        <button className="btn btn-primary right-space" onClick={this.handleExportReport}>
                            {T.translate("reports.export")}
                        </button>
                    </div>
                </div>
                <hr/>

                <div className="report-container">
                    <div className="panel panel-default">
                        <div className="panel-heading">Presentations ({totalCount})</div>

                        <Table
                            options={report_options}
                            data={reportData}
                            columns={report_columns}
                            onSort={this.handleSort}
                        />
                    </div>
                </div>

                <Pagination
                    bsSize="medium"
                    prev
                    next
                    ellipsis={false}
                    boundaryLinks={false}
                    maxButtons={1}
                    items={lastPage}
                    activePage={currentPage}
                    onSelect={this.handlePageChange}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ currentSummitState, currentReportState }) => ({
    currentSummit : currentSummitState.currentSummit,
    ...currentReportState
})

export default connect (
    mapStateToProps,
    {
        getReport,
    }
)(PresentationReport);
