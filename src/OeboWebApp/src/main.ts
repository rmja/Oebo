import "bootstrap/dist/css/bootstrap.css";

import { Aurelia, PLATFORM, autoinject } from 'aurelia-framework';
import { I18N } from "aurelia-i18n";
import * as Backend from "i18next-xhr-backend";

import { Http } from 'ur-http';
import { HttpClient, Interceptor } from 'aurelia-fetch-client';
// import { InitOptions } from "i18next";
import { Settings } from 'luxon';
import oidcConfig from "./oidc-config";
import { OpenIdConnect } from "aurelia-open-id-connect";

export async function configure(aurelia: Aurelia) {
    aurelia.use.standardConfiguration();

    if (__DEBUG__) {
        aurelia.use.developmentLogging();
    }

    aurelia.use
        .plugin(PLATFORM.moduleName("aurelia-fontawesome"))
        .plugin(PLATFORM.moduleName("aurelia-i18n"), (instance: I18N) => {
            instance.i18next.use(Backend);

            return instance.setup({
                backend: {
                    loadPath: 'locales/{{lng}}/{{ns}}.json'
                },
                lng: 'da',
                fallbackLng: false,
                ns: ['crossings', 'vehicles', 'ages']
            });
        })
        .plugin(PLATFORM.moduleName("aurelia-open-id-connect"), () => oidcConfig);

    aurelia.use.feature(PLATFORM.moduleName("value-converters/index"));

    Settings.defaultZoneName = 'Europe/Copenhagen';

    await aurelia.start();

    const httpClient = aurelia.container.get(HttpClient) as HttpClient;
    httpClient.configure(builder => builder.withBaseUrl("/api").withInterceptor(aurelia.container.get(TokenInterceptor)))
    Http.defaults.fetch = httpClient.fetch.bind(httpClient);

    await aurelia.setRoot(PLATFORM.moduleName('app'));
}

@autoinject()
class TokenInterceptor implements Interceptor {
    constructor(private oidc: OpenIdConnect) {
    }

    async request(request: Request) {
        const user = await this.oidc.getUser();
        
        if (user && !user.expired && user.access_token) {
            request.headers.set("Authorization", `Bearer ${user.access_token}`);
        }

        return request;
    }
}