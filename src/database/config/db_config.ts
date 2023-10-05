import { SecretManagerService } from '../../services/secret_manager/secret_manager.service';
import { Databases, DbText } from '../../enums/enums';
import { ConnectionOptions } from 'mysql2/promise';
import Logger from '../../logger/logger';

export class DbConfig {
    static async getDbConfigurations(database:Databases):Promise<ConnectionOptions> {
      let dbConfig:ConnectionOptions;
      let error:string;

      try {
        let secretName:string;
        let host:string;
        let dbName:string;
        Logger.debug(`DbConfig - Start getting the Database configurations`);

        if(database === Databases.Elig) {
          secretName = process.env.ELIGIBILITY_MYSQL_SECRET_NAME;
          host = process.env.ELIG_DB_HOST;
          dbName = process.env.ELIG_DB_NAME;
        } else if(database === Databases.Medical) {
          secretName = process.env.MEDICAL_MYSQL_SECRET_NAME;
          host = process.env.MED_DB_HOST;
          dbName = process.env.MED_DB_NAME;
        } else {
          Logger.warn(`DbConfig - DB name "${database}" not exists`);
          error = DbText.NotFoundDB;
        }    

        const parsedSecret:DbConnectionSecret = await SecretManagerService.getSecret(secretName);
        if (parsedSecret && parsedSecret.username && parsedSecret.password) {
          dbConfig = {
            host: host,
            user: parsedSecret.password,
            password: parsedSecret.password,
            database: dbName,
            port: Number(process.env.DB_PORT)
          };
        } else {
          Logger.warn(`DbConfig - Error in getting DB user and password from Secrets Manager`);
          error = DbText.EmptySecretMysql;
        }
      } catch (error:any) {
        error = error?.message;
        Logger.warn(`DbConfig - Error in getting the Databases configurations`, error);
      }

      if (!error) {
        return dbConfig;
      } else {
        throw new Error(error);
      }
    }
  }  

  interface DbConnectionSecret {
    username:string;
    password:string;
  }