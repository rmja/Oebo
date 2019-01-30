import { RouteConfig, RouterConfiguration } from "aurelia-router";

import { PLATFORM, autoinject, Disposable } from "aurelia-framework";
import { EventHub } from "./api/event-hub";
import { OpenIdConnect } from "aurelia-open-id-connect";
import { EventAggregator } from "aurelia-event-aggregator";
import { BookingStateChangedEvent } from "./api/events/booking-state-changed";

const routes: RouteConfig[] = [
    { route: "", name: "dashboard", moduleId: PLATFORM.moduleName("./dashboard") },
    { route: "crossings/:crossing/departures", name: "departures", moduleId: PLATFORM.moduleName("./departures"), activationStrategy: "replace" }
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