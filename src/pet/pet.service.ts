import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import { Pet } from './pet.entity';

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
        return await this.ddb.get({ TableName: this.tableName, Key: { 'documentNumber': id } }).promise()
    }

    async addPet(body: any): Promise<any> {
        let params = {
            TableName: this.tableName,
            Item: body
        }
        await this.ddb.put(params).promise()
        return { "message": "success" }
    }

    async updatePet(pet: Pet): Promise<any> {
        let params = {
            TableName: this.tableName,
            Key: {
                "id": pet.id
            },
            UpdateExpression:
                "set "
                + "name = :name "
                + "breed = :breed "
                + "size = :size "
                + "weigth = :weigth "
                + "image = :image "
                + "birthDay = :birthDay "
                + "dayOfRegistration = :dayOfRegistration "
                + "enabled = :enabled "
                + "petType = :petType "
                + "alerts = :alerts "
                + "heartRate = :heartRate "
                + "breathingFrequency = :breathingFrequency "
                + "sound = :sound "
                + "temperature = :temperature "
                + "recommendations = :recommendations",
            ExpressionAttributeValues: {
                ":name": pet.name,
                ":breed": pet.breed,
                ":size": pet.size,
                ":weigth": pet.weigth,
                ":image": pet.image,
                ":birthDay": pet.birthDay,
                ":dayOfRegistration": pet.dayOfRegistration,
                ":enabled": pet.enabled,
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
