import OracleDB = require('oracledb');
import { Injectable } from '@nestjs/common';
import { appConstants } from './constants';

@Injectable()
export class DatabaseService {

  connection: OracleDB.Connection | null = null;

  async getByQuery<T>(
    query: string, 
    params: Array<string | number>
  ): Promise<OracleDB.Result<T>> {
    return await this.connection.execute(query, params);
  }

  async onApplicationBootstrap() {
    try {
      this.connection = await OracleDB.getConnection( {
        user: appConstants.db_user,
        password: appConstants.db_password,
        connectString: appConstants.db_host + ":" + appConstants.db_port + "/" + appConstants.db_service
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onApplicationShutdown() {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
}
