import { Aurelia, PLATFORM } from 'aurelia-framework';

import { Http } from 'ur-http';
import { HttpClient } from 'aurelia-fetch-client';

export async function configure(aurelia: Aurelia) {
    aurelia.use.standardConfiguration();

    // if (__DEBUG__) {
    //     aurelia.use.developmentLogging();
    // }

    await aurelia.start();

    let httpClient = aurelia.container.get(HttpClient) as HttpClient;
    Http.defaults.fetch = httpClient.fetch.bind(httpClient);

    await aurelia.setRoot(PLATFORM.moduleName('app'));
}