import { autoinject, Disposable } from "aurelia-framework";

import { DateTime } from "luxon";
import { BookingApi } from "./api/booking-api";
import { HttpError } from "ur-http";
import { EventAggregator } from "aurelia-event-aggregator";
import { BookingStateChangedEvent } from "./api/events/booking-state-changed";
import { CrossingType } from "./api/crossing";
import { BookingState } from "./api/booking";

@autoinject()
export class Dashboard {
    bookings!: BookingViewModel[];
    private disposables!: Disposable[];

    dateTimeFormat = DateTime.DATETIME_MED;

    constructor(private bookingApi: BookingApi, private eventAggregator: EventAggregator) {
    }

    async activate() {
        try {
            this.bookings = await this.bookingApi.getAll().transfer();
        }
        catch (error) {
            if (error instanceof HttpError && error.statusCode === 401) {
                this.bookings = [];
            }
            else {
                throw error;
            }
        }

        this.disposables = [
            this.eventAggregator.subscribe(BookingStateChangedEvent, event => {
                const booking = this.bookings.find(x => x.id === event.bookingId);
                if (booking) {
                    booking.state = event.newState;
                }
            })
        ]
    }

    deactivate() {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
    }

    async cancel(booking: BookingViewModel) {
        await this.bookingApi.cancelOrDelete(booking.id).send();
    }

    async delete(booking: BookingViewModel) {
        await this.bookingApi.cancelOrDelete(booking.id).send();

        const index = this.bookings.indexOf(booking);
        this.bookings.splice(index, 1);
    }
}

interface BookingViewModel {
    id: number;
    state: BookingState;
    bookingNumber?: string;
    bookingPassword?: string;
    journeys: {
        crossing: CrossingType
        departure: DateTime;
    }[];
}