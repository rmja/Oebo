import { Http } from "ur-http";

export class MyBookingApi {
    cancel(bookingNumber: string, bookingPassword: string) {
        return Http.delete(`/MyBooking/Bookings/${bookingNumber}`, { bookingPassword: bookingPassword });
    }
}