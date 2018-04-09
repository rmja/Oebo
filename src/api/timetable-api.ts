import { CrossingType } from "./crossing";
import { DateTime } from "luxon";
import { DepartureInfo } from "./departure-info";
import { Http } from "ur-http";

export class TimetableApi {
    getDepartures(crossing: CrossingType, params?: { date?: DateTime, days?: number}) {
        params = params || {};

        let paramsMapped: { date?: string, days?: number} = {};

        if (params.date) {
            if (+params.date.startOf('day') !== +params.date) {
                throw Error("The date must not contain a time component");
            }
            paramsMapped.date = params.date.toFormat("yyyy-MM-dd");
        }
        paramsMapped.days = params.days;
        return Http.get(`/Timetable/Crossings/${crossing}/Departures`, paramsMapped).expectJsonArray(DepartureInfo);
    }
}