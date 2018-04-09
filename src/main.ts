import "bootstrap/dist/css/bootstrap.css";

import { Aurelia, PLATFORM } from 'aurelia-framework';
import { Backend, I18N } from "aurelia-i18n";

import { Http } from 'ur-http';
import { HttpClient } from 'aurelia-fetch-client';
import { InitOptions } from "i18next";
import { Settings } from 'luxon';

PLATFORM.moduleName("locales/da/crossings.json");

export async function configure(aurelia: Aurelia) {
    aurelia.use.standardConfiguration();

    if (__DEBUG__) {
        aurelia.use.developmentLogging();
    }

    aurelia.use.plugin(PLATFORM.moduleName("aurelia-dialog"));
    aurelia.use.plugin(PLATFORM.moduleName("aurelia-i18n"), (i18n: I18N) => {
        i18n.i18next.use(Backend.with(aurelia.loader));

        const options: any = {
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json'
            },
            lng: 'da',
            ns: ['crossings']
        };

        return i18n.setup(options);
    });

    aurelia.use.feature(PLATFORM.moduleName("value-converters/index"));

    Settings.defaultZoneName = 'Europe/Copenhagen';

    await aurelia.start();

    const httpClient = aurelia.container.get(HttpClient) as HttpClient;
    Http.defaults.fetch = httpClient.fetch.bind(httpClient);

    if (__DEBUG__) {
        httpClient.baseUrl = "http://localhost:51059";
    } else {
        httpClient.baseUrl = "https://laesoe-line-api.teambooking.dk";
    }

    await aurelia.setRoot(PLATFORM.moduleName('app'));
}