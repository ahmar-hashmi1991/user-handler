import express from 'express';
import * as core from 'express-serve-static-core';
import httpContext from 'express-http-context';
import ruid from 'express-ruid';
import dotenv from 'dotenv';
import Logger, { updateLoggerLevel } from '../logger/logger';
import { Endpoints } from '../endpoints/endpoints';
import { Database } from '../database/database';
import { SecretManagerService } from '../services/secret_manager/secret_manager.service';
import { ApiKeyValidator } from '../middlewares/api_key_validator/api_key_validator';
import { exit } from 'process';

export class Configurations {
    static async initServer():Promise<void> {
        try{
            const server:core.Express = express();
            Configurations.configureServer(server);        
            await Configurations.initDependencies();
            Endpoints.createEndpoints(server);
            Configurations.runServer(server);
        } catch (error: any) {
            Logger.error('InitServer - Error with initialing the server',error);
            exit();
        }
    }

    private static configureServer(server: core.Express): void {
        dotenv.config();
        server.use(express.urlencoded({ extended: true }));
        server.use(express.json());
        server.use(httpContext.middleware);
        server.use(ruid({setInContext: true}));
        server.use((_req, _res, next) => {
            httpContext.set('requestId', crypto.randomUUID());
            next();
        });
        server.use((req, res, next) => {
            ApiKeyValidator.validate(req, res, next);
        });
    }

    private static async initDependencies():Promise<void> {
        updateLoggerLevel();
        SecretManagerService.initSecretsManager();
        await Database.initDatabases();
    }

    private static runServer(server: core.Express): void {
        const port:number = +process.env.PORT;
        server.listen(port, () => {
            Logger.info(`The server is listening on port ${port}!`);
        });
    }
}
