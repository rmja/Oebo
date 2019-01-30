import { CrossingType } from "./crossing";
import { DateTime } from "luxon";
import { VehicleType } from "./vehicle";
import { jsonProperty } from "ur-json";
import { luxonConverter } from "./converters/luxon-converter";

export class Journey {
    @jsonProperty()
    id!: number;
    @jsonProperty()
    bookingId!: number;
    @jsonProperty()
    crossing!: CrossingType;
    @jsonProperty({ converter: luxonConverter })
    departure!: DateTime;
    @jsonProperty()
    vehicle!: VehicleType;
    @jsonProperty()
    passengers!: number;
    @jsonProperty()
    adults!: number;
    @jsonProperty()
    children!: number;
    @jsonProperty()
    seniors!: number;
    @jsonProperty()
    infants!: number;

    static createDriveIn(crossing: CrossingType, departure: DateTime, vehicle: VehicleType, passengers: number) {
        const journey = new Journey();

        journey.crossing = crossing;
        journey.departure = departure;
        journey.vehicle = vehicle;
        journey.passengers = passengers;

        return journey;
    }

    static createWalkIn(crossing: CrossingType, departure: DateTime, adults: number, children: number, seniors: number, infants: number) {
        const journey = new Journey();

        journey.crossing = crossing;
        journey.departure = departure;
        journey.vehicle = "car";
        journey.adults = adults;
        journey.children = children;
        journey.seniors = seniors;
        journey.infants = infants;

        return journey;
    }
}