import { DateObject } from '../models/DateObject';
import { TwitchMessage } from '../models/TwitchMessage';
import { TimeConverter } from '../util/TimeConverter';

export class ParserService {
    /**
     *
     * @param string the twitch message received from twitch
     * @returns the parsed TwitchMessage
     */
    public static parse(string: string): TwitchMessage | null {
        // Split the message into key-value pairs
        if (!string.includes(';')) return null;
        const pairs: string[] = string.split(';');

        // Construct JSON object
        const jsonObject: { [key: string]: string } = {};
        pairs.forEach((pair: string) => {
            if (pair.trim()) {
                // Check if the pair is not empty
                const [key, value] = pair.split('=');
                jsonObject[key.trim()] = value.trim();
            }
        });
        console.log(jsonObject);

        // if there is a user-message return TwitchMessage
        if (jsonObject['user-type'].includes('PRIVMSG')) {
            return this.mapToTwitchMessage(jsonObject);
        }

        // there is no user-message
        return null;
    }

    /**
     * parses the message from here: 'user-type': ':lost_in_trap!lost_in_trap@lost_in_trap.tmi.twitch.tv PRIVMSG #lost_in_trap :hello world'
     * and adds an json attribute
     * @param jsonObject
     * @returns
     */
    private static mapToTwitchMessage(jsonObject: { [key: string]: string }): TwitchMessage {
        // message in user-type right now
        const { username, message } = this.parseMessageFromUserType(jsonObject);

        const dateObject: DateObject = TimeConverter.convertTimestampToDateObject(parseInt(jsonObject['tmi-sent-ts']));

        return {
            displayName: jsonObject['display-name'],
            username,
            userId: jsonObject['user-id'],
            roomId: jsonObject['room-id'],
            subscriber: jsonObject['subscriber'],
            isMod: jsonObject['mod'],
            timestamp: jsonObject['tmi-sent-ts'],
            dateString: dateObject.dateString,
            timeString: dateObject.timeString,
            message,
        };
    }

    /**
     *
     * @param jsonObject contains user-type with message
     * @returns username and message from user-type
     */
    private static parseMessageFromUserType(jsonObject: { [key: string]: string }): { [key: string]: string } {
        const messageParts: string[] = jsonObject['user-type'].split(' PRIVMSG ');
        const username: string = messageParts[1].split(' ')[0].slice(1);
        const message: string = messageParts[1].split(' ').slice(1).join(' ').slice(1);

        return {
            username,
            message,
        };
    }
}
