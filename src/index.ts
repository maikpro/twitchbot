import express, { Request, Response } from 'express';
import { TokenService } from './services/token-service';
import { TwitchToken } from './models/TwitchToken';
import open from 'open';

export async function main() {
    // init server
    const app = express();
    const serverUrl: URL = new URL(process.env.SERVER_URL!);

    let token: TwitchToken | null = null;

    app.get('/', async (req: Request, res: Response) => {
        // Started Login Process
        if (req.query.code && !token) {
            token = await TokenService.getToken(req.query.code.toString());
            res.status(200).send(
                "Login successfully: <a href='/token'>See the token</a>",
            );
            console.log(
                `New Twitch Token has been generated: ${token.access_token}`,
            );
        }
        // logged in
        else if (token) {
            res.status(200).send(
                "You're logged in: <a href='/token'>See the token</a>" +
                    '<br>' +
                    "Validate the token here: <a href='/token/validate'>Validate!</a>",
            );
        }
        // start
        else {
            res.status(200).send(
                `Welcome <a href=${createAuthorizeUrl()}>Login</a>`,
            );
        }
    });

    app.get('/token', (req: Request, res: Response) => {
        if (token) {
            res.status(200).send(token);
        } else {
            res.status(404).send(
                `No Token found try to <a href=${createAuthorizeUrl()}>Login</a>`,
            );
        }
    });

    app.get('/token/validate', async (req: Request, res: Response) => {
        if (token) {
            const result = await TokenService.validate(token.access_token);
            res.status(200).send(result);
        } else {
            res.status(404).send(
                `No Token found try to <a href=${createAuthorizeUrl()}>Login</a>`,
            );
        }
    });

    app.listen(serverUrl.port, () => {
        console.log(`Twitch Bot app runs at ${serverUrl.href}`);
    });
}

function createAuthorizeUrl(): URL {
    const authorizeUrl: URL = new URL(process.env.AUTHORIZE_URL!);
    authorizeUrl.searchParams.append('response_type', 'code');
    authorizeUrl.searchParams.append('client_id', process.env.CLIENT_ID!);
    authorizeUrl.searchParams.append('redirect_uri', process.env.SERVER_URL!);
    authorizeUrl.searchParams.append('scope', 'chat:read chat:edit');
    authorizeUrl.searchParams.append('state', 'someState');
    return authorizeUrl;
}

main();
