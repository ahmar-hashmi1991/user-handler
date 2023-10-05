import { SecretManagerService } from "../../services/secret_manager/secret_manager.service";
import Logger from "../../logger/logger";
import { DbConfig } from "./db_config";
import { ConnectionOptions } from "mysql2/promise";
import { Databases } from "../../enums/enums";

describe('DbConfig', () => {
    let loggerDebugMock:jest.Mock;
    let loggerWarnMock:jest.Mock;
    let getSecretMock:jest.Mock;
    
    beforeEach(() => {
        Logger.info = jest.fn();
        Logger.debug = jest.fn();
        Logger.warn = jest.fn();
        Logger.error = jest.fn();
        SecretManagerService.getSecret = jest.fn();

        loggerDebugMock = Logger.debug as jest.Mock;
        loggerWarnMock = Logger.warn as jest.Mock;
        getSecretMock = SecretManagerService.getSecret as jest.Mock;
    });
  
    describe('getDbConfigurations', () => { 
        test('Should write warn log and throw error when logger.debug throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});

            try {
                await DbConfig.getDbConfigurations(Databases.Elig);
            } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(loggerWarnMock).toHaveBeenCalledTimes(1);
                expect(getSecretMock).not.toHaveBeenCalled();
            }
       });

       test('Should write warn log and throw error when getSecret() throws error', async () => {
            getSecretMock.mockImplementation(() => {throw new Error('error')});

            try {
                await DbConfig.getDbConfigurations(Databases.Elig);
            } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(getSecretMock).toHaveBeenCalledTimes(1);
                expect(loggerWarnMock).toHaveBeenCalledTimes(1);
            }
       });

       test('Should write warn log and throw error when getSecret() returns undefined secret', async () => {
            getSecretMock.mockReturnValue(undefined);

            try {
                await DbConfig.getDbConfigurations(Databases.Elig);
            } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(getSecretMock).toHaveBeenCalledTimes(1);
                expect(loggerWarnMock).toHaveBeenCalledTimes(1);
            }
       });

       test('Should write warn log and throw error when getSecret() returns secret without DB_USER', async () => {
            getSecretMock.mockReturnValue({password:'123'});

            try {
                await DbConfig.getDbConfigurations(Databases.Elig);
            } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(getSecretMock).toHaveBeenCalledTimes(1);
                expect(loggerWarnMock).toHaveBeenCalledTimes(1);
            }
       });

       test('Should write warn log and throw error when getSecret() returns secret without DB_PASSWORD', async () => {
            getSecretMock.mockReturnValue({username:'saeed'});

            try {
                await DbConfig.getDbConfigurations(Databases.Elig);
            } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(getSecretMock).toHaveBeenCalledTimes(1);
                expect(loggerWarnMock).toHaveBeenCalledTimes(1);
            }
        });

       test('Should return the DB configuration that build from environment variable and secret manager', async () => {
            getSecretMock.mockReturnValue({username:'saeed', password:'123'});
            const expectedResponse:ConnectionOptions = {
                host: process.env.DB_HOST,
                user: 'saeed',
                password: '123',
                database: process.env.DB_DATABASE,
                port: Number(process.env.DB_PORT)
              };

            const response:ConnectionOptions = await DbConfig.getDbConfigurations(Databases.Elig);

            expect(response).toEqual(expectedResponse);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(getSecretMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
       });
    });
});