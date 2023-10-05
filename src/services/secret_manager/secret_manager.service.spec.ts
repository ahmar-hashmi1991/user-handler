import { GetSecretValueCommandOutput, SecretsManager } from '@aws-sdk/client-secrets-manager';
import Logger from '../../logger/logger';
import { SecretManagerService } from './secret_manager.service'
import {fromSSO} from '@aws-sdk/credential-provider-sso';

describe('SecretManagerService', () => {
    let loggerInfoMock:jest.Mock;
    let loggerDebugMock:jest.Mock;
    let loggerWarnMock:jest.Mock;
    let loggerErrorMock:jest.Mock;
    let fromSsoMock:typeof fromSSO;
    let secretsManagerMock:SecretsManager;

    beforeEach(() => {
        Logger.info = jest.fn();
        Logger.debug = jest.fn();
        Logger.warn = jest.fn();
        Logger.error = jest.fn();
        loggerInfoMock = Logger.info as jest.Mock;
        loggerDebugMock = Logger.debug as jest.Mock;
        loggerWarnMock = Logger.warn as jest.Mock;
        loggerErrorMock = Logger.error as jest.Mock;
        fromSsoMock = jest.createMockFromModule<typeof fromSSO>('@aws-sdk/credential-provider-sso');
        secretsManagerMock = jest.createMockFromModule<SecretsManager>('@aws-sdk/client-secrets-manager');
        SecretManagerService.client = secretsManagerMock;
    });

    describe('getSecret', () => {
        let secretName:string;
        let jsonParseMock:jest.Mock;
        let getSecretValueMock:jest.Mock;

        beforeEach(() => {
            secretName = 'AhmarSecret';
            secretsManagerMock.getSecretValue = jest.fn();
            getSecretValueMock = secretsManagerMock.getSecretValue as jest.Mock;
        });


        test('Should write error log and throw error when Logger.debug throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});

            try {
                await SecretManagerService.getSecret(secretName);
              } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(loggerErrorMock).toHaveBeenCalledTimes(1);
                expect(loggerInfoMock).toHaveBeenCalledTimes(0);
                expect(secretsManagerMock.getSecretValue).not.toHaveBeenCalled();
              }
        });

        test('Should write error log and throw error when getSecretValue of SecretsManager throws error', async () => {
            getSecretValueMock.mockImplementation(() => {throw new Error('error')});

            try {
                await SecretManagerService.getSecret(secretName);
              } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(getSecretValueMock).toHaveBeenCalledTimes(1);
                expect(loggerErrorMock).toHaveBeenCalledTimes(1);
                expect(loggerInfoMock).toHaveBeenCalledTimes(0);
              }
        });

        test('Should return JSON of the secret when getSecretValue return string secret', async () => {
            const secretString:string = '{"token": "myStringSecret"}';
            const jsonParsedSecret:Object = {token: 'myStringSecret'};
            const getSecretValueResponse:GetSecretValueCommandOutput = {
                $metadata: {
                    httpStatusCode:200
                },
                SecretString: secretString
            };
            getSecretValueMock.mockReturnValue(getSecretValueResponse);

            let response:Object = await SecretManagerService.getSecret(secretName);

            expect(response).toEqual(jsonParsedSecret);
            expect(loggerDebugMock).toHaveBeenCalledTimes(2);
            expect(getSecretValueMock).toHaveBeenCalledTimes(1);
            expect(loggerErrorMock).toHaveBeenCalledTimes(0);
            expect(loggerInfoMock).toHaveBeenCalledTimes(0);
        })

        test('Should write error log and throw error when JSON.parse throws error', async () => {
            const getSecretValueResponse:GetSecretValueCommandOutput = {
                $metadata: {
                    httpStatusCode:200
                },
                SecretString: '{"token": myStringSecret}'
            };
            getSecretValueMock.mockReturnValue(getSecretValueResponse);
            JSON.parse = jest.fn();
            jsonParseMock = JSON.parse as jest.Mock;
            jsonParseMock.mockImplementation(() => {throw new Error('error')});

            try {
                await SecretManagerService.getSecret(secretName);
              } catch(error:any) {
                expect(loggerDebugMock).toHaveBeenCalledTimes(1);
                expect(getSecretValueMock).toHaveBeenCalledTimes(1);
                expect(jsonParseMock).toHaveBeenCalledTimes(1);
                expect(loggerErrorMock).toHaveBeenCalledTimes(1);
                expect(loggerInfoMock).toHaveBeenCalledTimes(0);
              }
        });
    });
});