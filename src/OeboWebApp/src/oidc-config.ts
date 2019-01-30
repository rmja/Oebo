import { OpenIdConnectConfiguration } from "aurelia-open-id-connect";
import { PLATFORM } from "aurelia-framework";
import { WebStorageStateStore, Log } from "oidc-client";

const appHost = PLATFORM.location.origin;

const postLogoutRedirectUri = `${appHost}/signout-oidc`;

const config: OpenIdConnectConfiguration = {
    loginRedirectRoute: "/",
    logoutRedirectRoute: "/",
    unauthorizedRedirectRoute: "/",
    logLevel: Log.DEBUG,
    userManagerSettings: {
        authority: `https://oebo.eu.auth0.com`,
        client_id: "M9k8YRELbbq4CMWE0BrasjH1VapElUk9",
        response_type: "id_token token",
        scope: "openid profile email",
        redirect_uri: `${appHost}/signin-oidc`,
        post_logout_redirect_uri: postLogoutRedirectUri,
        loadUserInfo: false,
        stateStore: new WebStorageStateStore({
            store: window.localStorage
        }),

        // Custom metadata is needed because auth0 does not include end_session_endpoint in .well-known
        // We therefore have to set all the endpoints manually
        metadata: {
            issuer: `https://oebo.eu.auth0.com/`,
            authorization_endpoint: `https://oebo.eu.auth0.com/authorize`,
            userinfo_endpoint: `https://oebo.eu.auth0.com/userinfo`,
            end_session_endpoint: `https://oebo.eu.auth0.com/v2/logout?returnTo=${encodeURIComponent(postLogoutRedirectUri)}`,
            jwks_uri: `https://oebo.eu.auth0.com/.well-known/jwks.json`,
        },

        extraQueryParams: {
            audience: "api://oebo"
        },
        
        silent_redirect_uri: `${appHost}/signin-oidc`,
        automaticSilentRenew: true,
        monitorSession: true
    }
}

export default config;