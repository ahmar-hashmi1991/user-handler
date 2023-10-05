import { DbConnectionService } from './db_connection.service';
import { Database } from '../../../src/database/database';
import Logger from '../../logger/logger';
import { RowDataPacket } from 'mysql2/promise';
import { ResponseInterface } from '../../interfaces/response';
import { DbText } from '../../enums/enums';

describe('DbConnectionService', () => {
    const eid:string = '888';
    const email:string = 'ahmarh@test.com';
    const uid:string = '786';
    let loggerInfoMock:jest.Mock;
    let loggerDebugMock:jest.Mock;
    let loggerWarnMock:jest.Mock;
    let loggerErrorMock:jest.Mock;
    let dbQueryMock:jest.Mock;

    beforeEach(() => {
        Logger.info = jest.fn();
        Logger.debug = jest.fn();
        Logger.warn = jest.fn();
        Logger.error = jest.fn();
        Database.query = jest.fn();
        loggerInfoMock = Logger.info as jest.Mock;
        loggerDebugMock = Logger.debug as jest.Mock;
        loggerWarnMock = Logger.warn as jest.Mock;
        loggerErrorMock = Logger.error as jest.Mock;
        dbQueryMock = Database.query as jest.Mock;
    });

    describe('getEidByEmail', () => {
        test('Should create warn log and throw error when Logger.debug() throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEidByEmail(email);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).not.toHaveBeenCalled();
            }
        });

        test('Should create warn log and throw error when Database.query() throws error', async () => {
            dbQueryMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEidByEmail(email);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).toHaveBeenCalledTimes(1);
            }
        });

        test('Should return result with error "notFoundIdentifier" when Database.query() result length is 0', async () => {
            const queryResults:RowDataPacket[] = [];
            const result:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEidByEmail(email);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });

        test('Should return result without error when Database.query() result length is not 0', async () => {
            const queryResultData:string = 'Ahmar Test'
            const queryResults:any[] = [queryResultData];
            const result:ResponseInterface = {
                result: queryResultData,
                error: undefined
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEidByEmail(email);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('getEmailByEid', () => {
        test('Should create warn log and throw error when Logger.debug() throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEmailByEid(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).not.toHaveBeenCalled();
            }
        });

        test('Should create warn log and throw error when Database.query() throws error', async () => {
            dbQueryMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEmailByEid(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).toHaveBeenCalledTimes(1);
            }
        });

        test('Should return result with error "notFoundIdentifier" when Database.query() result length is 0', async () => {
            const queryResults:RowDataPacket[] = [];
            const result:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEmailByEid(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });

        test('Should return result without error when Database.query() result length is not 0', async () => {
            const queryResultData:string = 'Ahmar Test'
            const queryResults:any[] = [queryResultData];
            const result:ResponseInterface = {
                result: queryResultData,
                error: undefined
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEmailByEid(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('getEmployerIdByEid', () => {
        test('Should create warn log and throw error when Logger.debug() throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEmployerIdByEid(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).not.toHaveBeenCalled();
            }
        });

        test('Should create warn log and throw error when Database.query() throws error', async () => {
            dbQueryMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEmployerIdByEid(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).toHaveBeenCalledTimes(1);
            }
        });

        test('Should return result with error "notFoundIdentifier" when Database.query() result length is 0', async () => {
            const queryResults:RowDataPacket[] = [];
            const result:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEmployerIdByEid(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });

        test('Should return result without error when Database.query() result length is not 0', async () => {
            const queryResultData:string = 'Ahmar Test'
            const queryResults:any[] = [queryResultData];
            const result:ResponseInterface = {
                result: queryResultData,
                error: undefined
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEmployerIdByEid(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('getEligibilityRulesByEmployerId', () => {
        test('Should create warn log and throw error when Logger.debug() throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEligibilityRulesByEmployerId(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).not.toHaveBeenCalled();
            }
        });

        test('Should create warn log and throw error when Database.query() throws error', async () => {
            dbQueryMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getEligibilityRulesByEmployerId(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).toHaveBeenCalledTimes(1);
            }
        });

        test('Should return result with error "notFoundIdentifier" when Database.query() result length is 0', async () => {
            const queryResults:RowDataPacket[] = [];
            const result:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEligibilityRulesByEmployerId(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });

        test('Should return result without error when Database.query() result length is not 0', async () => {
            const queryResultData:string = 'Ahmar Test'
            const queryResults:any[] = [queryResultData];
            const result:ResponseInterface = {
                result: queryResultData,
                error: undefined
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getEligibilityRulesByEmployerId(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('getUidByEid', () => {
        test('Should create warn log and throw error when Logger.debug() throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getUidByEid(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).not.toHaveBeenCalled();
            }
        });

        test('Should create warn log and throw error when Database.query() throws error', async () => {
            dbQueryMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getUidByEid(eid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).toHaveBeenCalledTimes(1);
            }
        });

        test('Should return result with error "notFoundIdentifier" when Database.query() result length is 0', async () => {
            const queryResults:RowDataPacket[] = [];
            const result:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getUidByEid(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });

        test('Should return result without error when Database.query() result length is not 0', async () => {
            const queryResultData:string = 'Ahmar Test'
            const queryResults:any[] = [queryResultData];
            const result:ResponseInterface = {
                result: queryResultData,
                error: undefined
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getUidByEid(eid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });
    });
    
    describe('getCurrAppVersionByUid', () => {
        test('Should create warn log and throw error when Logger.debug() throws error', async () => {
            loggerDebugMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getCurrAppVersionByUid(uid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).not.toHaveBeenCalled();
            }
        });

        test('Should create warn log and throw error when Database.query() throws error', async () => {
            dbQueryMock.mockImplementation(() => {throw new Error('error')});
 
            try {
              await DbConnectionService.getCurrAppVersionByUid(uid);
            } catch(error:any) {
              expect(loggerDebugMock).toHaveBeenCalledTimes(1);
              expect(dbQueryMock).toHaveBeenCalledTimes(1);
            }
        });

        test('Should return result with error "notFoundIdentifier" when Database.query() result length is 0', async () => {
            const queryResults:RowDataPacket[] = [];
            const result:ResponseInterface = {
                result: undefined,
                error: DbText.NotFoundIdentifier
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getCurrAppVersionByUid(uid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });

        test('Should return result without error when Database.query() result length is not 0', async () => {
            const queryResultData:string = 'Ahmar Test'
            const queryResults:any[] = [queryResultData];
            const result:ResponseInterface = {
                result: queryResultData,
                error: undefined
            };
            dbQueryMock.mockReturnValue(queryResults);
 
            let response:ResponseInterface = await DbConnectionService.getCurrAppVersionByUid(uid);

            expect(response).toEqual(result);
            expect(loggerDebugMock).toHaveBeenCalledTimes(1);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(loggerWarnMock).toHaveBeenCalledTimes(0);
        });
    });
});
