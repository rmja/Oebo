import { Departure } from "./departure";
import { jsonProperty } from "ur-json";

export class Timetable {
    @jsonProperty({ type: Departure })
    departures!: Departure[];
}