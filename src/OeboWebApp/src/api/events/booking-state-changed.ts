import { BookingState } from "../booking";

export class BookingStateChangedEvent {
    bookingId!: number
    newState!: BookingState

    static create(init: BookingStateChangedEvent) {
        return Object.assign(new BookingStateChangedEvent(), init);
    }
}