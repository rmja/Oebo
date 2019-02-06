import { autoinject, noView } from "aurelia-framework";
import { OpenIdConnect } from "aurelia-open-id-connect";
import { Redirect } from "aurelia-router";
import oidcConfig from "./oidc-config";

@autoinject()
export class Login {
    constructor(private oidc: OpenIdConnect) {
    }

    async canActivate(params: { loginRedirect?: string }) {
        const user = await this.oidc.getUser();

        if (user && !user.expired) {
            const loginRedirect = params.loginRedirect || oidcConfig.loginRedirectRoute;

            return new Redirect(loginRedirect);
        }

        return true;
    }

    attached() {
        return this.authenticate();
    }

    authenticate() {
        return this.oidc.login();
    }
}