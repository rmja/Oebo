import { BookResult } from "./book-result";
import { Http } from "ur-http";
import { Journey } from "./journey";

export class CustomerBookingApi {
    bookSeasonPassOneWay(username: string, password: string, command: {journey: Journey, local: boolean}) {
        return Http.post(`/CustomerBooking/Book/SeasonPass/OneWay`)
            .addHeader("authorization", "Basic " + btoa(`${username}:${password}`))
            .withJson(command).expectJson<BookResult>();
    }
}