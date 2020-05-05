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
import EmailTemplateForm from '../../components/forms/email-template-form';
import { getSummitById }  from '../../actions/summit-actions';
import { getEmailTemplate, resetTemplateForm, saveEmailTemplate } from "../../actions/email-actions";
//import '../../styles/edit-email-template-page.less';

class EditEmailTemplatePage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount () {
        let templateId = this.props.match.params.template_id;

        if (!templateId) {
            this.props.resetTemplateForm();
        } else {
            this.props.getEmailTemplate(templateId);
        }
    }

    componentWillReceiveProps(newProps) {
        let oldId = this.props.match.params.template_id;
        let newId = newProps.match.params.template_id;

        if (oldId != newId) {
            if (!newId) {
                this.props.resetTemplateForm();
            } else {
                this.props.getEmailTemplate(newId);
            }
        }
    }

    render(){
        let {currentSummit, entity, errors, match} = this.props;
        let title = (entity.id) ? T.translate("general.edit") : T.translate("general.add");
        let breadcrumb = (entity.id) ? entity.name : T.translate("general.new");

        return(
            <div className="container">
                <Breadcrumb data={{ title: breadcrumb, pathname: match.url }} ></Breadcrumb>
                <h3>{title} {T.translate("emails.email_template")}</h3>
                <hr/>
                {currentSummit &&
                <EmailTemplateForm
                    currentSummit={currentSummit}
                    entity={entity}
                    errors={errors}
                    onSubmit={this.props.saveEmailTemplate}
                />
                }
            </div>

        )
    }
}

const mapStateToProps = ({ currentSummitState, emailTemplateState }) => ({
    currentSummit : currentSummitState.currentSummit,
    ...emailTemplateState
})

export default connect (
    mapStateToProps,
    {
        getSummitById,
        getEmailTemplate,
        resetTemplateForm,
        saveEmailTemplate,
    }
)(EditEmailTemplatePage);