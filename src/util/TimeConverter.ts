import { DateObject } from '../models/DateObject';

export class TimeConverter {
    /**
     *
     * @param timestamp a Unix timestamp in milliseconds
     * @returns converted timestamp to a DateObject
     */
    public static convertTimestampToDateObject(timestamp: number): DateObject {
        const date = new Date(timestamp);
        const dateString = date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' });
        const timeString = date.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' });
        const dateTimeString = date.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

        return {
            dateString,
            timeString,
            dateTimeString,
        };
    }
}
