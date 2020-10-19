import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseUser } from './firebaseuser.entity';
import * as AWS from 'aws-sdk'

@Injectable()
export class FirebaseuserService {
    ddb: AWS.DynamoDB.DocumentClient;
    tableName: string = "firebaseuser";
    constructor() {
        this.ddb = new AWS.DynamoDB.DocumentClient();
    }

    async getKey(userDocument: string): Promise<any> {
        let res = await this.ddb.get({ TableName: this.tableName, Key: { 'userdocument': userDocument } }).promise()
        if (res.Item) {
            return res.Item
        }
        throw new NotFoundException()
    }

    async addKey(body: FirebaseUser): Promise<any> {
        console.log(body)
        let params = {
            TableName: this.tableName,
            Item: body
        }
        await this.ddb.put(params).promise()
        return { "message": "sucess", "id": body.userdocument }
    }
}
