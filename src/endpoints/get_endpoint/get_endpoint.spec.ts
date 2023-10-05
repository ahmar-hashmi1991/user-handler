import { GetEndpoint } from './get_endpoint';
import Logger from '../../logger/logger';
import { DbConnectionService } from '../../services/db_connection/db_connection.service';
import { ResponseInterface } from '../../interfaces/response';
import { DbText } from '../../enums/enums';

describe('GetEndpoint', () => {
    const eid:string = '786';
    const employerId:string = '10000';
    const email:string = 'ahmarh@test.com';
    const eligibility_rules:string = '{ "behaviors": ["useEidAsBrazeIdentifier"]}';
    const uid:string = '999';
    let loggerInfoMock:jest.Mock;
    let loggerDebugMock:jest.Mock;
    let loggerWarnMock:jest.Mock;
    let loggerErrorMock:jest.Mock;
    let requestMock:any;
    let responseMock:any;
    let getUserEidByEmailMock:jest.Mock;
    let getUserEmailByEidMock:jest.Mock;
    let getEmployerIdByEidMock:jest.Mock;
    let getEligibilityRulesByEmployerIdMock:jest.Mock;
    let getUidByEidMock:jest.Mock;
    let getCurrAppVersionByUidMock:jest.Mock;

    beforeEach(() => {
        Logger.info = jest.fn();
        Logger.debug = jest.fn();
        Logger.warn = jest.fn();
        Logger.error = jest.fn();
        loggerInfoMock = Logger.info as jest.Mock;
        loggerDebugMock = Logger.debug as jest.Mock;
        loggerWarnMock = Logger.warn as jest.Mock;
        loggerErrorMock = Logger.error as jest.Mock;
        DbConnectionService.getEidByEmail = jest.fn();
        DbConnectionService.getEmailByEid = jest.fn();
        DbConnectionService.getEmployerIdByEid = jest.fn();
        DbConnectionService.getEligibilityRulesByEmployerId = jest.fn();
        DbConnectionService.getUidByEid = jest.fn();
        DbConnectionService.getCurrAppVersionByUid = jest.fn();

        requestMock = {
            params: {
                eid, 
                email
            }
        };
        responseMock = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
          };

        getUserEidByEmailMock = DbConnectionService.getEidByEmail as jest.Mock;
        getUserEmailByEidMock = DbConnectionService.getEmailByEid as jest.Mock;
        getEmployerIdByEidMock = DbConnectionService.getEmployerIdByEid as jest.Mock;
        getEligibilityRulesByEmployerIdMock = DbConnectionService.getEligibilityRulesByEmployerId as jest.Mock;
        getUidByEidMock = DbConnectionService.getUidByEid as jest.Mock;
        getCurrAppVersionByUidMock = DbConnectionService.getCurrAppVersionByUid as jest.Mock;
    });

    fdescribe('getEidByEmail', () => {
        test('Should return status code 400 when got request without email', async () => {
            requestMock = {
                query: {
                    email: null
                }
            };

            await GetEndpoint.getEidByEmail(requestMock, responseMock);
            expect(responseMock.status).toHaveBeenCalledWith(400);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(1);
            expect(getUserEidByEmailMock).toHaveBeenCalledTimes(0);
        });

        test('Should return the eid when got request with email and DbConnectionService.getUserEidByEmailMock() returns value', async () => {
            const response:ResponseInterface = {
                result: eid,
                error: null
            }
            getUserEidByEmailMock.mockReturnValue(response);
            requestMock = {
                query: {
                    email: email
                }
            };
            await GetEndpoint.getEidByEmail(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toHaveBeenCalledWith(response.result);
            expect(getUserEidByEmailMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
            expect(loggerErrorMock).toHaveBeenCalledTimes(0);
        });
    });

    fdescribe('getEmailByEid', () => {
        test('Should return status code 400 when got request without eid', async () => {
            requestMock = {
                query: {
                    eid: null
                }
            };

            await GetEndpoint.getEmailByEid(requestMock, responseMock);
            expect(responseMock.status).toHaveBeenCalledWith(400);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(1);
            expect(getUserEmailByEidMock).toHaveBeenCalledTimes(0);
        });

        test('Should return the email when got request with eid and DbConnectionService.getUserEmailByEidMock() returns value', async () => {
            const response:ResponseInterface = {
                result: email,
                error: null
            }
            getUserEmailByEidMock.mockReturnValue(response);
            requestMock = {
                query: {
                    eid: eid
                }
            };
            await GetEndpoint.getEmailByEid(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toHaveBeenCalledWith(response.result);
            expect(getUserEmailByEidMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
            expect(loggerErrorMock).toHaveBeenCalledTimes(0);
        });
    });

    fdescribe('isEmployerUsingEid', () => {
        test('Should return status code 400 when got request without eid and employerId', async () => {
            requestMock = {
                query: {
                    userEid: null,
                    employerId: null
                }
            };

            await GetEndpoint.isEmployerUsingEid(requestMock, responseMock);
            expect(responseMock.status).toHaveBeenCalledWith(400);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(1);
        });

        test('Should return whether employer is using eid or not as braze identifier by passing emloyerId', async () => {
            const response:ResponseInterface = {
                result: { eligibility_rules: eligibility_rules },
                error: null
            };

            getEligibilityRulesByEmployerIdMock.mockReturnValue(response);

            requestMock = {
                query: {
                    employerId
                }
            };

            await GetEndpoint.isEmployerUsingEid(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toHaveBeenCalledWith(true);
            expect(getEmployerIdByEidMock).toHaveBeenCalledTimes(0);
            expect(getEligibilityRulesByEmployerIdMock).toHaveBeenCalledTimes(1);
        });

        test('Should return whether employer is using eid or not as braze identifier by passing userEid', async () => {
            const response:ResponseInterface = {
                result: employerId,
                error: null
            }
            getEmployerIdByEidMock.mockReturnValue(response);

            const response1:ResponseInterface = {
                result: { eligibility_rules: eligibility_rules },
                error: null
            };

            getEligibilityRulesByEmployerIdMock.mockReturnValue(response1);

            requestMock = {
                query: {
                    userEid: eid
                }
            };

            await GetEndpoint.isEmployerUsingEid(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toHaveBeenCalledWith(true);
            expect(getEmployerIdByEidMock).toHaveBeenCalledTimes(1);
            expect(getEligibilityRulesByEmployerIdMock).toHaveBeenCalledTimes(1);
        });

        test('Should return status code 400 when got request without eid and employerId', async () => {
            requestMock = {
                query: {
                    userEid: eid,
                    employerId: employerId
                }
            };

            await GetEndpoint.isEmployerUsingEid(requestMock, responseMock);
            expect(responseMock.status).toHaveBeenCalledWith(400);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(1);
        });
    });

    fdescribe('isUserUsingNewAppVersion', () => {
        test('Should return status code 400 when got request without eid', async () => {
            requestMock = {
                query: {
                    userEid: null
                }
            };

            await GetEndpoint.isUserUsingNewAppVersion(requestMock, responseMock);
            expect(responseMock.status).toHaveBeenCalledWith(400);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(1);
        });

        test('Should return error when passing incorrect eid', async () => {
            const response:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };

            getUidByEidMock.mockReturnValue(response);

            requestMock = {
                query: {
                    userEid: eid
                }
            };

            await GetEndpoint.isUserUsingNewAppVersion(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(404);
            expect(getUidByEidMock).toHaveBeenCalledTimes(1);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
        });

        test('Should return true when passing correct eid of user using latest app version', async () => {
            const response:ResponseInterface = {
                result: uid,
                error: undefined
            };

            getUidByEidMock.mockReturnValue(response);

            const response1:ResponseInterface = {
                result: {
                    current_app_ver: '5.6.4'
                },
                error: undefined
            }

            getCurrAppVersionByUidMock.mockReturnValue(response1);

            requestMock = {
                query: {
                    userEid: eid
                }
            };

            await GetEndpoint.isUserUsingNewAppVersion(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toBeCalledWith(true);
            expect(getUidByEidMock).toHaveBeenCalledTimes(1);
            expect(getCurrAppVersionByUidMock).toHaveBeenCalledTimes(1);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
        });

        test('Should return false when passing correct eid of user not using latest app version', async () => {
            const response:ResponseInterface = {
                result: uid,
                error: undefined
            };

            getUidByEidMock.mockReturnValue(response);

            const response1:ResponseInterface = {
                result: {
                    current_app_ver: '5.6.1'
                },
                error: undefined
            }

            getCurrAppVersionByUidMock.mockReturnValue(response1);

            requestMock = {
                query: {
                    userEid: eid
                }
            };

            await GetEndpoint.isUserUsingNewAppVersion(requestMock, responseMock);

            expect(responseMock.status).toHaveBeenCalledWith(200);
            expect(responseMock.send).toBeCalledWith(false);
            expect(getUidByEidMock).toHaveBeenCalledTimes(1);
            expect(getCurrAppVersionByUidMock).toHaveBeenCalledTimes(1);
            expect(loggerInfoMock).toHaveBeenCalledTimes(1);
        });
    });
})