import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk'

@Injectable()
export class UserService {
  ddb :AWS.DynamoDB.DocumentClient
  constructor() {
    this.ddb = new AWS.DynamoDB.DocumentClient();
  }
  async getUsers(): Promise<any> {
    return await this.ddb.get({TableName:'user',Key:{}}).promise()
  }
  async getUser(id: string): Promise<any> {
    return await this.ddb.get({TableName:'user',Key:{'documentNumber':id}}).promise()
  }
  async addUser(body:any  ): Promise<any> {
    let  params  = {
      TableName: 'user',
      Item : body
    }
    await this.ddb.put(params).promise()
    return {"message": "sucess"}
  }
  updateUser(id: string): any {
    return {}
  }
  deleteUser(id: string): any {
    return {}
  }
}
