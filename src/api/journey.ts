import { CrossingType } from "./crossing";
import { DateTime } from "luxon";
import { VehicleType } from "./vehicle";

export interface Journey {
    crossing: CrossingType;
    departure: DateTime;
    passengers: number;
    vehicle: VehicleType;
}