import { PLATFORM, autoinject } from "aurelia-framework";

import { BookingsStorage } from "./services/bookings-storage";
import { ConfigService } from "./services/config-service";
import { CrossingType } from "./api/crossing";
import { CustomerBookingApi } from "./api/customer-booking-api";
import { DateTime } from "luxon";
import { DialogService } from "aurelia-dialog";
import { MyBookingApi } from "./api/my-booking-api";
import { TimetableApi } from "./api/timetable-api";

@autoinject()
export class Departures {
    private crossing!: CrossingType;
    departuresByDay = new Map<number, DepartureViewModel[]>();

    dateFormat = DateTime.DATE_HUGE;

    constructor(private timetableApi: TimetableApi, private customerBookingApi: CustomerBookingApi, private myBookingApi: MyBookingApi, private configService: ConfigService, private bookingsStorage: BookingsStorage, private dialog: DialogService) {
    }

    async activate(params: { crossing: CrossingType }) {
        this.crossing = params.crossing;
        const departures = await this.timetableApi.getDepartures(params.crossing, { days: 2 }).transfer();

        const bookings = await this.bookingsStorage.getBookings();

        for (const departureInfo of departures) {
            const day = +departureInfo.departure.startOf('day');

            const booking = bookings.find(x => x.crossing === this.crossing && +x.departure === +departureInfo.departure && !x.isCancelled) || null;
            const isAvailable = departureInfo.availability[this.configService.vehicle].isAvailable;

            const departuresOnDay = this.departuresByDay.get(day) || [];
            departuresOnDay.push({
                departure: departureInfo.departure,
                isAvailable: isAvailable,
                isBusy: false,
                booking: booking
            });
            this.departuresByDay.set(day, departuresOnDay);
        }
    }

    async book(departureVM: DepartureViewModel) {
        departureVM.isBusy = true;

        const credentials = await this.getCredentials();

        if (credentials) {
            const result = await this.customerBookingApi.bookSeasonPassOneWay(credentials.username, credentials.password, {
                journey: {
                    crossing: this.crossing,
                    departure: departureVM.departure,
                    passengers: 1,
                    vehicle: this.configService.vehicle
                },
                local: this.configService.local
            }).send().then(response => response.ensureSuccessfulStatusCode().receive());

            await this.bookingsStorage.addBooking({
                bookingNumber: result.bookingNumber,
                bookingPassword: result.bookingPassword,
                crossing: this.crossing,
                departure: departureVM.departure
            });

            departureVM.booking = result;
        }

        departureVM.isBusy = false;
    }

    async cancel(departureVM: DepartureViewModel) {
        departureVM.isBusy = true;

        if (departureVM.booking) {
            await this.myBookingApi.cancel(departureVM.booking.bookingNumber, departureVM.booking.bookingPassword).send().then(x => x.ensureSuccessfulStatusCode());

            await this.bookingsStorage.cancelBooking(departureVM.booking.bookingNumber);

            departureVM.booking = null;
        }

        departureVM.isBusy = false;
    }

    private async getCredentials(): Promise<{ username: string, password: string } | null> {
        if (this.configService.username && this.configService.password) {
            return {
                username: this.configService.username,
                password: this.configService.password
            };
        }
        const loginResult = await this.dialog.open({
            viewModel: PLATFORM.moduleName("login-dialog")
        }).whenClosed();

        if (!loginResult.wasCancelled) {
            this.configService.username = loginResult.output.username;
            this.configService.password = loginResult.output.password;
            return loginResult.output;
        }

        return null;
    }

    getDateByValue(value: number) {
        return DateTime.fromMillis(value);
    }
}

interface DepartureViewModel {
    departure: DateTime;
    isAvailable: boolean;
    isBusy: boolean;
    booking: {
        bookingNumber: string;
        bookingPassword: string;
    } | null;
}