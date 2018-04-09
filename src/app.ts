import { RouteConfig, RouterConfiguration } from "aurelia-router";

import { PLATFORM } from "aurelia-framework";

const routes: RouteConfig[] = [
    { route: "", name: "dashboard", moduleId: PLATFORM.moduleName("./dashboard") },
    { route: "crossings/:crossing/departures", name: "departures", moduleId: PLATFORM.moduleName("./departures"), activationStrategy: "replace" }
];

export class App {
    configureRouter(config: RouterConfiguration) {
        config.map(routes);
    }
}