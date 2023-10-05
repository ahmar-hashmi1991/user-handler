import { exit } from "process";
import { ResponseInterface } from "../../interfaces/response";
import { DbConnectionService } from "../../services/db_connection/db_connection.service";
import Logger from "../../logger/logger";
import { Request, Response } from 'express';
import { compareAppsVersions } from "../../utils/compare_apps_versions/create_apps_version";
import { xnor } from "../../utils/xnor/xnor";

export class GetEndpoint {
    static async getEidByEmail(req:Request, res:Response): Promise<void> {
        const email: string = (req as any).query?.email;
        try {
            Logger.info(`GetEndpoint - Got request to getEidByEmail for Email:${email}.`);
            if (!email) {
                Logger.warn(`getEidByEmail - Get request without email.`);
                res.status(400).send('The request must contain an email');
            } else {
                const response:ResponseInterface = await DbConnectionService.getEidByEmail(email);
                if (response.error) {
                    res.status(404).send(response.error);
                } else {
                    res.status(200).send(response.result);
                }
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async getEmailByEid(req:Request, res:Response): Promise<void> {
        const eid: string = (req as any).query?.eid;
        try {
            Logger.info(`GetEndpoint - Got request to getEmailByEid for eid:${eid}.`);
            if (!eid) {
                Logger.warn(`getEmailByEid - Get request without eid.`);
                res.status(400).send('The request must contain an eid');
            } else {
                const response: ResponseInterface = await DbConnectionService.getEmailByEid(eid);
                if (response.error) {
                    res.status(404).send(response.error);
                } else {
                    res.status(200).send(response.result);                    
                } 
            } 
        }
        catch (error) {
            res.status(500).send(error);
        }
    }

    static async isEmployerUsingEid(req:Request, res:Response): Promise<void> {
        let employerId: string = (req as any).query?.employerId;
        const userEid: string = (req as any).query?.userEid;
        try {
            Logger.info(`GetEndpoint - Got request to isEmployerUsingEid for employerId:${employerId} and userEid:${userEid}.`);
            if (xnor(employerId, userEid)) {
                Logger.warn(`isEmployerUsingEid - Get request without eid and employerId. Either provide eid, or employerId, but not both or none.`);
                res.status(400).send('The request must contain either employer Id or user Eid, but not both or none.');
            } else {
                if (!employerId) {
                    const response: ResponseInterface = await DbConnectionService.getEmployerIdByEid(userEid);
                    if (response.error) {
                        res.status(404).send(response.error);
                        exit();
                    }
                    employerId = response.result?.employer_id;
                }
                const response: ResponseInterface = await DbConnectionService.getEligibilityRulesByEmployerId(employerId);
                if (response.error) {
                    res.status(404).send(response.error);
                } else {
                    let eligibility_rules = JSON.parse(response.result?.eligibility_rules);
                    const isEmployerUsingEid: boolean = eligibility_rules?.behaviors?.includes("useEidAsBrazeIdentifier");
                    res.status(200).send(isEmployerUsingEid);
                }
            }
        }
        catch (error) {
            res.status(500).send(error);
        }        
    }

    static async isUserUsingNewAppVersion(req:Request, res:Response): Promise<void> {
        const userEid: string = (req as any).query?.userEid;
        try {
            Logger.info(`GetEndpoint - Got request to isUserUsingNewAppVersion for userEid:${userEid}.`);
            if (!userEid) {
                Logger.warn(`isUserUsingNewAppVersion - Get request without eid.`);
                res.status(400).send('The request must contain an eid');
            } else {
                let response: ResponseInterface = await DbConnectionService.getUidByEid(userEid);
                if (response.error) {
                    res.status(404).send(response.error);
                } else {
                    const uid: string = response.result?.uid;
                    response = await DbConnectionService.getCurrAppVersionByUid(uid);
                    if (response.error) {
                        res.status(404).send(response.error);
                    } else {
                        const current_app_ver: string = response.result?.current_app_ver;
                        const least_compatible_app_ver: string = process.env.LEAST_COMPATIBLE_APP_VERSION;
                        if (compareAppsVersions(current_app_ver, least_compatible_app_ver) >= 0) {
                            res.status(200).send(true);
                        } else {
                            res.status(200).send(false);
                        }
                    }
                }
            }             
        } catch (error) {
            res.status(500).send(error);
        }    
    }
}