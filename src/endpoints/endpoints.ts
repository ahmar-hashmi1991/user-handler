import * as core from 'express-serve-static-core'
import { GetEndpoint } from './get_endpoint/get_endpoint'
import { Request, Response } from 'express';

export class Endpoints {
    static createEndpoints(server: core.Express):void {
        server.get('/api/user/getEidByEmail', (req:Request, res:Response) => GetEndpoint.getEidByEmail(req, res));
        server.get('/api/user/getEmailByEid', (req:Request, res:Response) => GetEndpoint.getEmailByEid(req, res));
        server.get('/api/user/isEmployerUsingEid', (req:Request, res:Response) => GetEndpoint.isEmployerUsingEid(req, res));
        server.get('/api/user/isUserUsingNewAppVersion', (req:Request, res:Response) => GetEndpoint.isUserUsingNewAppVersion(req, res));
    }
}
