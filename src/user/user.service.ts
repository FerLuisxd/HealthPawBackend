import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk'

@Injectable()
export class UserService {
  ddb :AWS.DynamoDB.DocumentClient
  tableName:string
  constructor() {
    this.ddb = new AWS.DynamoDB.DocumentClient();
    this.tableName = 'user'
  }
  async getUsers(): Promise<any> {
    let res = await this.ddb.scan({TableName:'user'}).promise()
    return res.Items
  }

  async getUser(id: string): Promise<any> {
    return await this.ddb.get({TableName:'user',Key:{'documentNumber':id}}).promise()
  }
  async addUser(body:any  ): Promise<any> {
    let  params  = {
      TableName: this.tableName,
      Item : body
    }
    await this.ddb.put(params).promise()
    return {"message": "sucess"}
  }
  updateUser(id: string): any {
    return {}
  }
  async addPetToUser(id: string,pet:Object): Promise<any> {
    var params = {
      TableName:this.tableName,
      Key:{
          "documentNumber": id
      },
      UpdateExpression: "set pets = list_append(pets,:p)",
      ExpressionAttributeValues:{
          ":p":[pet]
      },
      ReturnValues:"ALL_NEW"
  };
  
    let res = await this.ddb.update(params).promise()
    return res.Attributes
  }
  deleteUser(id: string): any {
    return {}
  }
}
