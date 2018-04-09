import { DateTime } from "luxon";
import { VehicleType } from "./vehicle";
import { jsonProperty } from "ur-json";
import { luxonConverter } from "./converters/luxon-converter";

export class DepartureInfo {
    @jsonProperty({ converter: luxonConverter })
    departure!: DateTime;
    @jsonProperty()
    availability!: {[vehicle in VehicleType]: { isAvailable: boolean }};
}