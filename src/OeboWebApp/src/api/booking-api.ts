import { Http } from "ur-http";
import { Journey } from "./journey";
import { Booking } from "./booking";
import { OpenIdConnect } from "aurelia-open-id-connect";
import { autoinject } from "aurelia-framework";

@autoinject()
export class BookingApi {
    constructor(private oidc: OpenIdConnect) {
    }

    create(command: Partial<Journey>[], username: string, password: string) {
        return Http.post("/Bookings", { username, password })
            .withJson(command)
            .expectJson<Booking>();
    }

    getAll() {
        return Http.get("/Bookings")
            .expectJsonArray(Booking);
    }

    cancelOrDelete(id: number) {
        return Http.delete(`/Bookings/${id}`);
    }
}