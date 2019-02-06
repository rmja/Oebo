import { RouteConfig, RouterConfiguration } from "aurelia-router";

import { PLATFORM, autoinject, Disposable } from "aurelia-framework";
import { EventHub } from "./api/event-hub";
import { OpenIdConnect, OpenIdConnectRoles } from "aurelia-open-id-connect";
import { EventAggregator } from "aurelia-event-aggregator";
import { BookingStateChangedEvent } from "./api/events/booking-state-changed";

const routes: RouteConfig[] = [
    { route: "", name: "dashboard", moduleId: PLATFORM.moduleName("./dashboard") },
    { route: "login", name: "login", moduleId: PLATFORM.moduleName("./login") },
    { route: "crossings/:crossing/departures", name: "departures", moduleId: PLATFORM.moduleName("./departures"), activationStrategy: "replace" },
    { route: "crossings/:crossing/departures/:departure/book", name: "book", moduleId: PLATFORM.moduleName("./book"), activationStrategy: "replace", settings: { roles: [OpenIdConnectRoles.Authenticated] } }
];

@autoinject()
export class App {
    notifications: Notification[] = [];
    private disposables!: Disposable[];

    constructor(private eventHub: EventHub, private oidc: OpenIdConnect, private eventAggregator: EventAggregator) {
    }

    async activate() {
        await this.eventHub.connect();

        this.disposables = [
            this.eventAggregator.subscribe(BookingStateChangedEvent, event => {
                switch (event.newState) {
                    case "pendingConfirmation":
                        this.notifications.push({
                            title: "Aventer bekræftelse",
                            descriptions: "HEll"
                        });
                        break;
                    case "confirmed":
                        this.notifications.push({
                            title: "Booking bekræftet",
                            descriptions: "Bookingen er bekræftet"
                        });
                        break;
                    case "pendingCancellation":
                        this.notifications.push({
                            title: "Afventer annulering",
                            descriptions: "Hell"
                        });
                        break;
                    case "cancelled":
                        this.notifications.push({
                            title: "Annulering bekræftet",
                            descriptions: "Annuleringen er bekræftet"
                        });
                        break;
                    case "failedInvalidLogin":
                        this.notifications.push({
                            title: "Forkert login",
                            descriptions: "Booking kunne ikke oprettes pga. forkert brugernavn eller password"
                        });
                        break;
                }
            })
        ];
    }

    async deactivate() {
        await this.eventHub.disconnect();

        for (const disposable of this.disposables) {
            disposable.dispose();
        }
    }

    configureRouter(config: RouterConfiguration) {
        config.options.pushState = true;
        config.map(routes);
        this.oidc.configure(config);
    }

    login() {
        this.oidc.login();
    }

    logout() {
        this.oidc.logout();
    }
}

interface Notification {
    title: string;
    descriptions: string;
}