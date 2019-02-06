import { HubConnectionBuilder, HubConnection, HubConnectionState } from "@aspnet/signalr";
import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { BookingStateChangedEvent } from "./events/booking-state-changed";
import { OpenIdConnect } from "aurelia-open-id-connect";
import { BookingState } from "./booking";

@autoinject()
export class EventHub {
    private connection: HubConnection;
    private connectionEstablished = false;

    constructor(private eventAggregator: EventAggregator, private oidc: OpenIdConnect) {
        this.connection = new HubConnectionBuilder()
            .withUrl("/events", {
                accessTokenFactory: async () => {
                    const user = await oidc.getUser();
                    
                    return user.access_token;
                }
            })
            .build();

        this.connection.on("booking-state-changed", (bookingId: number, newState: BookingState) => this.eventAggregator.publish(BookingStateChangedEvent.create({ bookingId, newState })));

        oidc.observeUser(async user => {
            if (this.connection.state === HubConnectionState.Connected) {
                await this.connection.stop();
            }

            if (user && this.connectionEstablished) {
                await this.connection.start();
            }
        });
    }

    async connect() {
        const user = await this.oidc.getUser();

        if (user && !user.expired) {
            await this.connection.start();
        }

        this.connectionEstablished = true;
    }

    async disconnect() {
        if (this.connectionEstablished) {
            await this.connection.stop();
        }
    }
}