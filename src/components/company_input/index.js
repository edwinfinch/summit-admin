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

import React from 'react';
import 'react-select/dist/react-select.css';
import Select from 'react-select';
import {queryCompanies} from '../../actions/actions';

export default class CompanyInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
        this.getCompanies = this.getCompanies.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.value != nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    handleChange(value) {
        this.setState({
            value: value
        });

        let ev = {target: {
            id: this.props.id,
            value: value,
            type: 'companyinput'
        }};

        this.props.onChange(ev);
    }

    getCompanies (input) {
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        return queryCompanies(input);
    }

    processTagValues(new_values) {
        let values = [];

        for(let i in new_values) {
            values.push({value: new_values[i].id, label: new_values[i].name});
        }

        return values;
    }

    render() {

        return (
            <Select.Async
                multi={this.props.multi}
                value={this.processTagValues(this.state.value)}
                onChange={this.handleChange}
                loadOptions={this.getCompanies}
                backspaceRemoves={true}
            />
        );

    }
}
