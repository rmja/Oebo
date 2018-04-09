import { jsonProperty, modelBind, serialize } from "ur-json";

import { CrossingType } from "../api/crossing";
import { DateTime } from "luxon";
import { luxonConverter } from "../api/converters/luxon-converter";

export class BookingsStorage {
    async getBookings() {
        const json = window.localStorage.getItem("bookings");

        if (json) {
            const bookings: IBooking[] = JSON.parse(json).map((x: any) => modelBind(Booking, x));

            // Remove old bookings
            const today = DateTime.local().startOf("day");
            const oldBookings = bookings.filter(x => x.departure < today);

            if (oldBookings.length > 0) {
                for (const booking of oldBookings) {
                    const index = bookings.indexOf(booking);
                    bookings.splice(index, 1);
                }
                this.saveBookings(bookings);
            }

            return bookings;
        }

        return [];
    }

    async addBooking(booking: IBooking) {
        const bookings = await this.getBookings();

        bookings.push(booking);

        this.saveBookings(bookings);
    }

    async cancelBooking(bookingNumber: string) {
        const bookings = await this.getBookings();

        const booking = bookings.find(x => x.bookingNumber === bookingNumber);

        if (booking) {
            booking.isCancelled = true;
            
            this.saveBookings(bookings);
        }
    }

    private saveBookings(bookings: Booking[]) {
        window.localStorage.setItem("bookings", serialize(bookings));
    }
}

export interface IBooking {
    bookingNumber: string;
    bookingPassword: string;
    crossing: CrossingType;
    departure: DateTime;
    isCancelled?: boolean;
}

export class Booking implements IBooking {
    @jsonProperty()
    bookingNumber!: string;
    @jsonProperty()
    bookingPassword!: string;
    @jsonProperty()
    crossing!: CrossingType;
    @jsonProperty({ converter: luxonConverter })
    departure!: DateTime;
    @jsonProperty()
    isCancelled?: boolean;
}