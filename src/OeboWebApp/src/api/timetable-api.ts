import { CrossingType } from "./crossing";
import { DateTime } from "luxon";
import { Http } from "ur-http";
import { Timetable } from "./timetable";

export class TimetableApi {
    getTimetable(crossing: CrossingType, params?: { date?: DateTime, days?: number}) {
        params = params || {};
        
        return Http.get(`/Timetable/${crossing}`, {
            ...(params.date && { date: params.date.toFormat("yyyy-MM-dd") }),
            days: params.days
        })
            .expectJson(Timetable);
    }
}