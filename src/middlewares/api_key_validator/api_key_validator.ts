import { SecretManagerService } from '../../services/secret_manager/secret_manager.service';
import { Request, Response, NextFunction } from 'express';
import { ClientResponseMessages, StatusCodes } from '../../enums/enums';
import Logger from '../../logger/logger';

export class ApiKeyValidator {
    private static apiToken:string;

    static async initServiceApiToken():Promise<void> {
        try {
            Logger.info(`InitServiceApiToken - Start initilizing the API token for the service`);
            const expectedApiKey:ApiTokenSecret = await SecretManagerService.getSecret(process.env.SERVICE_API_TOKEN_SECRET_NAME);
            ApiKeyValidator.apiToken = expectedApiKey.token;
            Logger.info(`InitServiceApiToken - Finish initilizing the API token for the service`);
        } catch(error:any) {
            Logger.error(`InitServiceApiToken - Error while initilizing the API token for the service`, error);
        }
    }

    static async validate(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const apiKey:string = req.headers['x-api-key'] as string;
            let isValidApiKey:boolean = false;

            if(apiKey) {
                const serverApiKey:string = await ApiKeyValidator.getServerApiToken();
                if (apiKey === serverApiKey) {
                    isValidApiKey = true;
                    next();
                }
            }     
            if(!isValidApiKey) {
                res.status(StatusCodes.Unauthorized).send(ClientResponseMessages.Unauthorized);
            }
        } catch(error) {
            Logger.error('ApiKeyValidator.validate - Validation error.' + error);
            res.status(StatusCodes.InternalError).send(ClientResponseMessages.InternalError);
        }
    }

    private static async getServerApiToken():Promise<string> {
        let serverApiToken:string;

        if (ApiKeyValidator.apiToken) {
            serverApiToken = ApiKeyValidator.apiToken;
        } else {
            const expectedApiKey:ApiTokenSecret = await SecretManagerService.getSecret(process.env.SERVICE_API_TOKEN_SECRET_NAME);
            serverApiToken = expectedApiKey.token;
        }

        return serverApiToken;
    }
}

interface ApiTokenSecret {
    token:string;
}