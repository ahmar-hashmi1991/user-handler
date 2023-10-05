import {fromSSO} from '@aws-sdk/credential-provider-sso';
import { GetSecretValueCommandInput, GetSecretValueCommandOutput, SecretsManager, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';
import { Environments } from '../../enums/enums';
import Logger  from '../../logger/logger';

export class SecretManagerService {
    static client:SecretsManager;

    static async initSecretsManager():Promise<void> {
        Logger.info(`InitSecretsManager - Start initilizing the Secrets Manager connection`);
        const config:SecretsManagerClientConfig = SecretManagerService.getSecretManagerConfiguration();
        SecretManagerService.client = new SecretsManager(config);
        Logger.info(`InitSecretsManager - Finish initilizing the Secrets Manager connection`);
    }

    static async getSecret(secretName:string):Promise<any> {
        let secret:any;
    
        try {
            Logger.debug(`GetSecret - got request to get the secret '${secretName}' from secret manager`);
            const params:GetSecretValueCommandInput = { SecretId: secretName };
            const data:GetSecretValueCommandOutput = await SecretManagerService.client.getSecretValue(params);

            if(data.SecretString) {
                secret = JSON.parse(data.SecretString);
            } else {
                const secretFromBinary:string = Buffer.from(data.SecretBinary).toString('base64');
                secret = JSON.parse(secretFromBinary);
            }
            Logger.debug(`GetSecret - success getting secret '${secretName}' from secret manager`);

            return secret;
        } catch (error:any) {
            Logger.error(`GetSecret - Error retrieving secret '${secretName}'.`, error);
            throw error;
        }
    }

    private static getSecretManagerConfiguration():SecretsManagerClientConfig {
        const config:SecretsManagerClientConfig = {region: process.env.AWS_REGION};
        return process.env.ENV === Environments.Dev ? {...config, credentials: fromSSO()} : config;
    }
}
