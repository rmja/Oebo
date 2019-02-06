import { autoinject, Disposable } from "aurelia-framework";

import { CrossingType } from "./api/crossing";
import { DateTime } from "luxon";
import { TimetableApi } from "./api/timetable-api";
import { BookingApi } from "./api/booking-api";
import { EventAggregator } from "aurelia-event-aggregator";
import { BookingStateChangedEvent } from "./api/events/booking-state-changed";
import { BookingState, Booking } from "./api/booking";
import { HttpError } from "ur-http";

@autoinject()
export class Departures {
    crossing!: CrossingType;
    departuresByDay = new Map<number, DepartureViewModel[]>();

    dateFormat = DateTime.DATE_HUGE;
    private disposables!: Disposable[];

    constructor(private timetableApi: TimetableApi, private bookingApi: BookingApi, private eventAggregator: EventAggregator) {
    }

    async activate(params: { crossing: CrossingType }) {
        this.crossing = params.crossing;
        const timetable = await this.timetableApi.getTimetable(params.crossing, { days: 2 }).transfer();

        let bookings: Booking[];

        try {
            bookings = await this.bookingApi.getAll().transfer();
        } catch (error) {
            if (error instanceof HttpError && error.statusCode === 401) {
                bookings = [];
            }
            else {
                throw error;
            }
        }

        for (const departure of timetable.departures) {
            const day = +departure.departs.startOf('day');

            if (departure.state !== "expired") {
                const departureBookings = bookings.filter(b => !!b.journeys.find(j => j.crossing === this.crossing && +j.departure === +departure.departs));

                const departuresOnDay = this.departuresByDay.get(day) || [];
                departuresOnDay.push({
                    departs: departure.departs,
                    state: departure.state,
                    bookings: departureBookings
                });
                this.departuresByDay.set(day, departuresOnDay);
            }
        }

        this.disposables = [
            this.eventAggregator.subscribe(BookingStateChangedEvent, event => {
                for (const dayDepartures of Array.from(this.departuresByDay.values())) {
                    for (const departure of dayDepartures) {
                        for (const booking of departure.bookings) {
                            if (booking.id === event.bookingId) {
                                console.log("Setting state from ", booking.state, "to", event.newState);
                                booking.state = event.newState;
                                return;
                            }
                        }
                    }
                }
            })
        ];
    }

    deactivate() {
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
    }

    async cancel(booking: BookingViewModel) {
        await this.bookingApi.cancelOrDelete(booking.id).send();
    }

    getDateByValue(value: number) {
        return DateTime.fromMillis(value);
    }

    getNextDepartures() {
        
    }
}

interface DepartureViewModel {
    departs: DateTime;
    state: "available" | "soldOut";
    bookings: BookingViewModel[];
}

interface BookingViewModel {
    id: number;
    bookingNumber?: string;
    state: BookingState;
}