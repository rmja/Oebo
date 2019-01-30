import { DateTime } from 'luxon';

export class LocalFormatValueConverter {
    toView(value: DateTime, format: string | Intl.DateTimeFormatOptions) {
        if (value && value.isValid) {
            if (typeof format === "string") {
                return value.toLocal().toFormat(format);
            }
            else {
                return value.toLocal().toLocaleString(format);
            }
        }
    }
}