import { TwitchToken } from '../models/TwitchToken';

export class AuthService {
    public static createAuthorizeUrl(): URL {
        const authorizeUrl: URL = new URL(process.env.AUTHORIZE_URL!);
        authorizeUrl.searchParams.append('response_type', 'code');
        authorizeUrl.searchParams.append('client_id', process.env.CLIENT_ID!);
        authorizeUrl.searchParams.append('redirect_uri', process.env.REDIRECT_URI!);
        authorizeUrl.searchParams.append('scope', 'chat:read chat:edit');
        authorizeUrl.searchParams.append('state', 'someState');
        return authorizeUrl;
    }

    public static async getToken(authCode: string): Promise<TwitchToken> {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const tokenUrl = process.env.TOKEN_URL;
        const redirectUri = process.env.REDIRECT_URI;

        if (!clientId || !clientSecret || !tokenUrl || !redirectUri) {
            throw 'Some values are missing in .env to create a token';
        }

        const response: Response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: authCode,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });

        if (!response.ok) {
            throw 'Failed! Could not create a twitch token...';
        }

        return await response.json();
    }

    public static async validate(accessToken: string): Promise<any> {
        console.log(`Validates the token...`);
        const url = 'https://id.twitch.tv/oauth2/validate';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `OAuth ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw 'Could not validate access token...';
        }

        return await response.json();
    }
}
