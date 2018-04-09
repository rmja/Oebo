import { autoinject, observable } from "aurelia-framework";

import { BookingsStorage } from "./services/bookings-storage";
import { ConfigService } from "./services/config-service";
import { CrossingType } from "./api/crossing";
import { DateTime } from "luxon";
import { MyBookingApi } from "./api/my-booking-api";
import { VehicleType } from "./api/vehicle";
import { extend } from "lodash";

@autoinject()
export class Dashboard {
    bookings!: BookingViewModel[];
    @observable()
    vehicle!: VehicleType;

    dateTimeFormat = DateTime.DATETIME_MED;

    constructor(private myBookingApi: MyBookingApi, private bookingsStorage: BookingsStorage, private configService: ConfigService) {
        this.vehicle = configService.vehicle;
    }

    vehicleChanged() {
        this.configService.vehicle = this.vehicle;
    }

    async activate() {
        const bookings = await this.bookingsStorage.getBookings();

        this.bookings = bookings.map(x => extend(x, { isBusy: false }));
    }

    async cancel(booking: BookingViewModel) {
        booking.isBusy = true;

        await this.myBookingApi.cancel(booking.bookingNumber, booking.bookingPassword).send().then(x => x.ensureSuccessfulStatusCode());

        await this.bookingsStorage.cancelBooking(booking.bookingNumber);

        booking.isCancelled = true;
        booking.isBusy = false;
    }
}

interface BookingViewModel {
    crossing: CrossingType;
    departure: DateTime;
    bookingNumber: string;
    bookingPassword: string;
    isBusy: boolean;
    isCancelled?: boolean;
}