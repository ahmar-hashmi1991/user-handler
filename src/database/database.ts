import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';
import { DbConfig } from './config/db_config';
import Logger from '../logger/logger';
import { Databases } from '../enums/enums';

export class Database {
    private static eligConnection:Connection;
    private static medicalConnection:Connection;
    
    static async initDatabases():Promise<void> {
        try {
            Logger.info(`InitDatabase - Start initilizing the Databases connections`);
            const isEligConnected:boolean = await Database.configure(Databases.Elig);
            const isMedConnected:boolean = await Database.configure(Databases.Medical);

            if (!isEligConnected || !isMedConnected) {
                throw new Error('Error while connecting to DBs');
            }
            Logger.info('InitDatabase - Successfully connected to DBs');
        } catch (error:any) {
            Logger.error('InitDatabase - Error while connecting to DBs', error);
            throw error;
        }
    }

    static async disconnect(database:Databases):Promise<void> {
        try {
            if (database === Databases.Elig && Database.eligConnection) {
                await Database.eligConnection.end();
            } else if (database === Databases.Medical && Database.medicalConnection) {
                await Database.medicalConnection.end();
            } else {
                throw new Error(`Error while disconnecting the DB:${database}`);      
            }
            Logger.info(`Disconnected from the database:${database}`);
        } catch (error) {
            Logger.error(`Error disconnecting from the database:${database}`, error);
            throw error;
        }
    }

    static async query(database:Databases, sql:string, values?:any[]):Promise<any> {
        try {
            let rows:any;
            if (database === Databases.Elig) {
                [rows] = await Database.eligConnection.query(sql, values);
            } else if (database === Databases.Medical) {
                [rows] = await Database.medicalConnection.query(sql, values);
            } else {
                throw new Error(`Error while querying the DB: ${database}`);
            }
            return rows;
        } catch (error:any) {
            Logger.error(`Error executing query form DB: ${database}`, error);
            throw error;
        }
    }

    private static async configure(database:Databases):Promise<boolean> {
        try {
            const config:ConnectionOptions = await DbConfig.getDbConfigurations(database);
            
            if (database === Databases.Elig) {
                Database.eligConnection = await mysql.createConnection(config);
            } else if (database === Databases.Medical) {
                Database.medicalConnection = await mysql.createConnection(config);
            } else {
                throw new Error(`Error while configuring the DB: ${database}`);
            }
            Logger.info(`Connected to the database: ${database}`);
            return true;
        } catch (error:any) {
            Logger.error('Error connecting to DB:', error.sqlMessage || error);
            throw error;
        }
    }
}