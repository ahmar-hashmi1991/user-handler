import { RowDataPacket } from 'mysql2/promise';
import { Database } from '../../database/database';
import Logger from '../../logger/logger';
import { ELIG_GET_QUERIES, MED_GET_QUERIES } from '../../database/queries/db_queries'
import { ResponseInterface } from '../../interfaces/response';
import { Databases, DbText } from '../../enums/enums';

export class DbConnectionService {
    static async getEidByEmail(email:string):Promise<ResponseInterface> {
        try {
            Logger.debug(`Inside getEidByEmail`);
            const selectQuery:string = ELIG_GET_QUERIES.getEidByEmail;
            const result:RowDataPacket[] = await Database.query(Databases.Elig, selectQuery, [email, email]);
            let response:ResponseInterface;

            if (!result?.length) {
                response = {
                    result: undefined,
                    error: DbText.NotFoundIdentifier
                }
            } else {
                response = {
                    result: result[0],
                    error: undefined
                }
            }
            Logger.info(`getEidByEmail - Success`);
            return response;
        } catch (error) {
            Logger.error(`getEidByEmail - Error while getting eid`);
            throw error;
        }
    }

    static async getEmailByEid(eid:string):Promise<ResponseInterface> {
        try {
            Logger.debug(`Inside getEmailByEid`);
            const selectQuery:string = ELIG_GET_QUERIES.getEmailByEid;
            const result:RowDataPacket[] = await Database.query(Databases.Elig, selectQuery, [eid]);
            let response:ResponseInterface;
            
            if (!result?.length) {
                response = {
                    result: undefined,
                    error: DbText.NotFoundIdentifier
                }
            } else {
                response = {
                    result: result[0],
                    error: undefined
                }
            }
            Logger.info(`getEmailByEid - Success`);
            return response;
        } catch (error) {
            Logger.error(`getEmailByEid - Error while getting email`);
            throw error;
        }
    }

    static async getEmployerIdByEid(eid:string):Promise<ResponseInterface> {
        try {
            Logger.debug(`Inside getEmployerIdByEid`);
            const selectQuery:string = ELIG_GET_QUERIES.getEmployerIdByEid;
            const result:RowDataPacket[] = await Database.query(Databases.Elig, selectQuery, [eid]);
            let response:ResponseInterface;
            
            if (!result?.length) {
                response = {
                    result: undefined,
                    error: DbText.NotFoundIdentifier
                }
            } else {
                response = {
                    result: result[0],
                    error: undefined
                }
            }
            Logger.info(`getEmployerIdByEid - Success`);
            return response;
        } catch (error) {
            Logger.error(`getEmployerIdByEid - Error while getting employerId`);
            throw error;
        }
    }

    static async getEligibilityRulesByEmployerId(employerId:string):Promise<ResponseInterface> {
        try {
            Logger.debug(`Inside getEligibilityRulesByEmployerId`);
            const selectQuery:string = ELIG_GET_QUERIES.getEligibilityRulesByEmployerId;
            const result:RowDataPacket[] = await Database.query(Databases.Elig, selectQuery, [employerId]);
                        
            let response:ResponseInterface;
            
            if (!result?.length) {
                response = {
                    result: undefined,
                    error: DbText.NotFoundIdentifier
                }
            } else {
                response = {
                    result: result[0],
                    error: undefined
                }
            }
            Logger.info(`getEligibilityRulesByEmployerId - Success`);
            return response;    
        } catch (error) {
            Logger.error(`getEligibilityRulesByEmployerId - Error while getting eligibility rules`);
            throw error;
        }
    }

    static async getUidByEid(eid:string):Promise<ResponseInterface> {
        try {
            Logger.debug(`Inside getUidByEid`);
            const selectQuery:string = MED_GET_QUERIES.getUidByEid;
            const result:RowDataPacket[] = await Database.query(Databases.Medical, selectQuery, [eid]);
            let response:ResponseInterface;
            
            if (!result?.length) {
                response = {
                    result: undefined,
                    error: DbText.NotFoundIdentifier
                }
            } else {
                response = {
                    result: result[0],
                    error: undefined
                }
            }
            Logger.info(`getUidByEid - Success`);
            return response;
        } catch (error) {
            Logger.error(`getUidByEid - Error while getting uid`);
            throw error;
        }
    }

    static async getCurrAppVersionByUid(uid:string):Promise<ResponseInterface> {
        try {
            Logger.debug(`Inside getCurrAppVersionByUid`);
            const selectQuery:string = MED_GET_QUERIES.getCurrAppVersionByUid;
            const result:RowDataPacket[] = await Database.query(Databases.Medical, selectQuery, [uid]);
            let response:ResponseInterface;
            
            if (!result?.length) {
                response = {
                    result: undefined,
                    error: DbText.NotFoundIdentifier
                }
            } else {
                response = {
                    result: result[0],
                    error: undefined
                }
            }
            Logger.info(`getCurrAppVersionByUid - Success`);
            return response;
        } catch (error) {
            Logger.error(`getCurrAppVersionByUid - Error while getting curr app version`);
            throw error;
        }    
    }
    
}
