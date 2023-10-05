import Logger from "../../logger/logger";
import { SecretManagerService } from "../../services/secret_manager/secret_manager.service";
import { ApiKeyValidator } from "./api_key_validator";

describe('ApiKeyValidator', () => {
    let loggerErrorMock:jest.Mock;
    let getSecretMock:jest.Mock;
    let requestMock:any;
    let responseMock:any;
    let nextFunctionMock:any;
    
    beforeEach(() => {
        Logger.info = jest.fn();
        Logger.debug = jest.fn();
        Logger.warn = jest.fn();
        Logger.error = jest.fn();
        SecretManagerService.getSecret = jest.fn();
        loggerErrorMock = Logger.error as jest.Mock;
        getSecretMock = SecretManagerService.getSecret as jest.Mock;
        requestMock = {
            headers: {
                "x-api-key":'saeedToken'
            }
        };
        responseMock = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        nextFunctionMock = jest.fn();
    });
  
    describe('validate', () => { 
        test('Should write error log and return status code 500 when request does not have headers', async () => {
            await ApiKeyValidator.validate({} as any, responseMock, nextFunctionMock);
           
            expect(responseMock.status).toHaveBeenCalledWith(500);
            expect(nextFunctionMock).not.toHaveBeenCalled();
            expect(loggerErrorMock).toHaveBeenCalled();
            expect(getSecretMock).not.toHaveBeenCalled();
       });

       test('Should return status code 401 when req.header does not contain "x-api-key"', async () => {
            await ApiKeyValidator.validate({headers:{}} as any, responseMock, nextFunctionMock);
            
            expect(responseMock.status).toHaveBeenCalledWith(401);
            expect(nextFunctionMock).not.toHaveBeenCalled();
            expect(loggerErrorMock).not.toHaveBeenCalled();
            expect(getSecretMock).not.toHaveBeenCalled();
       });

       test('Should write error log and return status code 500 when SecretManagerService.getSecret() throws error', async () => {
            getSecretMock.mockImplementation(() => {throw new Error('error')});

            await ApiKeyValidator.validate(requestMock, responseMock, nextFunctionMock);
            
            expect(responseMock.status).toHaveBeenCalledWith(500);
            expect(nextFunctionMock).not.toHaveBeenCalled();
            expect(loggerErrorMock).toHaveBeenCalled();
            expect(getSecretMock).toHaveBeenCalled();
       });

       test('Should return status code 401 when "x-api-key" value is different from the service token', async () => {
            const serviceToken:{ token: string } = {token: 'diff'};
            getSecretMock.mockReturnValue(serviceToken);

            await ApiKeyValidator.validate(requestMock, responseMock, nextFunctionMock);
            
            expect(responseMock.status).toHaveBeenCalledWith(401);
            expect(getSecretMock).toHaveBeenCalled();
            expect(nextFunctionMock).not.toHaveBeenCalled();
            expect(loggerErrorMock).not.toHaveBeenCalled();
       });

       test('Should call next() function when "x-api-key" value is equals to the service token', async () => {
            const serviceToken:{ token: string } = {token: 'saeedToken'};
            getSecretMock.mockReturnValue(serviceToken);

            await ApiKeyValidator.validate(requestMock, responseMock, nextFunctionMock);
            
            expect(getSecretMock).toHaveBeenCalled();
            expect(nextFunctionMock).toHaveBeenCalled();
            expect(loggerErrorMock).not.toHaveBeenCalled();
       });
    });
});