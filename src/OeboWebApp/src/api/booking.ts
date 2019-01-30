import { Journey } from "./journey";
import { DateTime } from "luxon";
import { jsonProperty } from "ur-json";
import { luxonConverter } from "./converters/luxon-converter";

export type BookingState = "created" | "pendingConfirmation" | "confirmed" | "pendingCancellation" | "cancelled" | "failed";

export class Booking {
    @jsonProperty()
    id!: number;
    @jsonProperty()
    state!: BookingState;
    @jsonProperty({ type: Journey })
    journeys!: Journey[];
    @jsonProperty()
    bookingNumber?: string;
    @jsonProperty()
    bookingPassword?: string;
    @jsonProperty({ converter: luxonConverter })
    created!: DateTime;
}