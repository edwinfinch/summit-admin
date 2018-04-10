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
import { Breadcrumb } from 'react-breadcrumbs';
import PromocodeForm from '../../components/forms/promocode-form';
import { getSummitById }  from '../../actions/summit-actions';
import { getPromocode, getPromocodeMeta, resetPromocodeForm, sendEmail, savePromocode } from "../../actions/promocode-actions";
import '../../styles/edit-promocode-page.less';

class EditPromocodePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            promocodeId: props.match.params.promocode_id
        }
    }

    componentWillReceiveProps(nextProps) {
        let {promocodeId} = this.state;

        let new_promocode_id = nextProps.match.params.promocode_id;

        if(promocodeId != new_promocode_id) {

            this.setState({promocodeId: new_promocode_id});

            if(new_promocode_id) {
                this.props.getPromocode(new_promocode_id);
            } else {
                this.props.resetPromocodeForm();
            }
        }
    }

    componentWillMount () {
        let {allTypes} = this.props;

        if(allTypes.length == 1){
            this.props.getPromocodeMeta();
        }
    }

    componentDidMount () {
        let {currentSummit, errors} = this.props;
        let promocodeId = this.props.match.params.promocode_id;

        if(currentSummit != null) {
            if (promocodeId != null) {
                this.props.getPromocode(promocodeId);
            } else {
                this.props.resetPromocodeForm();
            }
        }
    }

    render(){
        let {currentSummit, allTypes, allClasses, entity, errors, match} = this.props;
        let title = (entity.id) ? T.translate("general.edit") : T.translate("general.add");
        let breadcrumb = (entity.id) ? entity.name : T.translate("general.new");

        return(
            <div className="container">
                <Breadcrumb data={{ title: breadcrumb, pathname: match.url }} ></Breadcrumb>
                <h3>{title} {T.translate("edit_promocode.promocode")}</h3>
                <hr/>
                {currentSummit &&
                <PromocodeForm
                    history={this.props.history}
                    currentSummit={currentSummit}
                    allTypes={allTypes}
                    allClasses={allClasses}
                    entity={entity}
                    errors={errors}
                    onSendEmail={this.props.sendEmail}
                    onSubmit={this.props.savePromocode}
                />
                }
            </div>
        )
    }
}

const mapStateToProps = ({ currentSummitState, currentPromocodeState }) => ({
    currentSummit : currentSummitState.currentSummit,
    ...currentPromocodeState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getPromocode,
        getPromocodeMeta,
        resetPromocodeForm,
        sendEmail,
        savePromocode,
    }
)(EditPromocodePage);