import T from "i18n-react/dist/i18n-react";
import {createAction, getRequest, startLoading, stopLoading} from "openstack-uicore-foundation";
import swal from "sweetalert2";
import {authErrorHandler, apiBaseUrl} from "./base-actions";
import { AdminGroupCode } from '../constants';


export const SET_LOGGED_USER                = 'SET_LOGGED_USER';
export const LOGOUT_USER                    = 'LOGOUT_USER';
export const REQUEST_USER_INFO              = 'REQUEST_USER_INFO';
export const RECEIVE_USER_INFO              = 'RECEIVE_USER_INFO';

export const doLogin = (backUrl = null) => {

    let oauth2ClientId = process.env['OAUTH2_CLIENT_ID'];
    let baseUrl        = process.env['IDP_BASE_URL'];
    let scopes         = process.env['SCOPES'];
    let redirectUri    =  window.location.origin+'/auth/callback';
    if(backUrl != null)
        redirectUri += `?BackUrl=${encodeURIComponent(backUrl)}`;

    var authUrl        = baseUrl +"/oauth2/auth"+
        "?response_type=token id_token" +
        "&approval_prompt=force"+
        "&prompt=login+consent"+
        "&scope=" + encodeURI(scopes)+
        "&nonce=12345"+
        "&client_id="  + encodeURI(oauth2ClientId) +
        "&redirect_uri=" + redirectUri;

    window.location = authUrl;
}

export const onUserAuth = (accessToken, idToken) => (dispatch) => {
    dispatch({
        type: SET_LOGGED_USER,
        payload: {accessToken, idToken}
    });
}

export const doLogout = () => (dispatch) => {
    dispatch({
        type: LOGOUT_USER,
        payload: {}
    });
}

export const getUserInfo = () => (dispatch, getState) => {

    let { loggedUserState } = getState();
    let { accessToken, member }     = loggedUserState;
    if(member != null) return;


    getRequest(
        createAction(REQUEST_USER_INFO),
        createAction(RECEIVE_USER_INFO),
        `${apiBaseUrl}/api/v1/members/me?expand=groups&access_token=${accessToken}`,
        authErrorHandler
    )({})(dispatch, getState).then(() => {

            let { member } = getState().loggedUserState;
            if( member == null || member == undefined){
                swal("ERROR", T.translate("errors.user_not_set"), "error");
                dispatch({
                    type: LOGOUT_USER,
                    payload: {}
                });
            }

            let adminGroup = member.groups.filter((group, idx) => {
                return group.code === AdminGroupCode;
            })

            if(adminGroup.length == 0){
                swal("ERROR", T.translate("errors.user_not_authz") , "error");
                dispatch({
                    type: LOGOUT_USER,
                    payload: {}
                });
            }
        }
    );
}