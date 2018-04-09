import { DateTime } from 'luxon';
import { JsonConverter } from 'ur-json';

class LuxonConverter implements JsonConverter {
    fromJson(source: any) {
        return DateTime.fromISO(source);
    }
}

export const luxonConverter = new LuxonConverter();