import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import { Pet } from './pet.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment'
@Injectable()
export class PetService {
    ddb: AWS.DynamoDB.DocumentClient;
    tableName: string = "pet";

    constructor() {
        this.ddb = new AWS.DynamoDB.DocumentClient();
    }

    async getPets(): Promise<any> {
        let results = await this.ddb.scan({ TableName: this.tableName }).promise();
        return results.Items;
    }

    async getPet(id: string): Promise<any> {
        let res = await this.ddb.get({ TableName: this.tableName, Key: { 'id': id } }).promise()
        if(res.Item){
            return res.Item
        }
        throw new NotFoundException()
    }

    async addPet(body: Pet): Promise<any> {
        body.id  = uuidv4();
        body.dayOfRegistration = moment().toISOString()
        if(body.birthDay) body.birthDay = moment(body.birthDay).toISOString()
        body.alerts = []
        body.breathingFrequency = []
        body.heartRate = []
        body.recommendations = []
        body.sound = []
        body.temperature = []
        let params = {
            TableName: this.tableName,
            Item: body
        }
        await this.ddb.put(params).promise()
        return { "message": "sucess" , "id" : body.id }
    }

    async updatePet(id:string,pet: Pet): Promise<any> {
        if(pet.birthDay) pet.birthDay = moment(pet.birthDay).toISOString()
        let query = "set "
        let keys = Object.keys(pet)
        for (let index = 0; index < keys.length; index++) {
          let variable = keys[index];
            query += `${variable} = :${variable}`
    
          if (index < keys.length - 1) {
            query += ','
          }
        }
        let params = {
            TableName: this.tableName,
            Key: {
                "id": id
            },
            UpdateExpression:query,
            ExpressionAttributeValues: {
                ":namevar": pet.namevar,
                ":breed": pet.breed,
                ":size": pet.size,
                ":weigth": pet.weigth,
                ":image": pet.image,
                ":birthDay": pet.birthDay,
                ":dayOfRegistration": pet.dayOfRegistration,
                ":active": pet.active,
                ":petType": pet.petType,
                ":alerts": pet.alerts,
                ":heartRate": pet.heartRate,
                ":breathingFrequency": pet.breathingFrequency,
                ":sound": pet.sound,
                ":temperature": pet.temperature,
                ":recommendations": pet.recommendations
            },
            ReturnValues: "UPDATED_NEW"
        };
        await this.ddb.update(params).promise();
        return { "message": "sucess" };
    }

    async deletePet(id: string): Promise<any> {
        let params = {
            TableName: this.tableName,
            Key: {
                "id": id
            },
        };
        await this.ddb.delete(params).promise();
        return { "message": "sucess" };
    }
}
