import { ParserService } from './parser-service';
import { AuthService } from './token-service';
import WebSocket from 'ws';

export class TwitchService {
    public static connect(): void {
        console.log(`Twitch Token will be used for WebSocket Connection ${AuthService.getToken()?.access_token}`);

        const websocketUrl = process.env.WEBSOCKET_URL;
        const username = process.env.USERNAME;
        const channelsString = process.env.CHANNELS;

        if (!username || !websocketUrl || !channelsString) {
            throw 'websocketurl, username or channels are missing in .env to connect';
        }

        const ws = new WebSocket(websocketUrl, 'irc', {});
        ws.on('open', () => {
            console.log('WebSocket Client Connected');
            console.log(`${AuthService.getToken()?.access_token}`);

            // Send CAP (optional), PASS, and NICK messages
            ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            ws.send(`PASS oauth:${AuthService.getToken()?.access_token}`);
            ws.send(`NICK ${username}`);

            if (channelsString?.includes(',')) {
                const channels = channelsString.split(',');
                channels.forEach((channel) => {
                    console.log(`Joining ${channel}...`);
                    ws.send(`JOIN #${channel.trim()}`);
                });
            } else {
                // Join a channel
                ws.send(`JOIN #${channelsString}`);
            }
        });

        ws.on('message', (data: WebSocket.Data) => {
            const message = data.toString();

            if (message.startsWith('PING')) {
                // Respond to PING messages to prevent disconnection
                ws.send('PONG :tmi.twitch.tv');
            } else {
                console.log('Received message:', message);
                const twitchMessage = ParserService.parse(message);

                if (twitchMessage) {
                    console.log(twitchMessage);
                }
            }
        });

        ws.on('close', () => {
            console.log('Disconnected from WebSocket server');
        });

        ws.on('error', (error: Error) => {
            console.error('WebSocket error:', error.message);
        });
    }
}
