import { DateTime } from "luxon";
import { jsonProperty } from "ur-json";
import { luxonConverter } from "./converters/luxon-converter";
import { CrossingType } from "./crossing";

export type DepartureState = "available" | "soldOut" | "expired";

export class Departure {
    @jsonProperty()
    crossing!: CrossingType;
    @jsonProperty({ converter: luxonConverter })
    departs!: DateTime;
    @jsonProperty({ converter: luxonConverter })
    arrives!: DateTime;
    @jsonProperty()
    state!: DepartureState;
}