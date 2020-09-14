import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import { Pet, Stadistics } from './pet.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment'
@Injectable()
export class PetService {
    ddb: AWS.DynamoDB.DocumentClient;
    tableName: string = "pet";
    intervalMax: Number
    constructor() {
        this.ddb = new AWS.DynamoDB.DocumentClient();
        this.intervalMax = 24 * 60 * 60 / 20
    }

    async getPets(): Promise<any> {
        let results = await this.ddb.scan({ TableName: this.tableName }).promise();
        return results.Items;
    }

    async getPet(id: string): Promise<any> {
        let res = await this.ddb.get({ TableName: this.tableName, Key: { 'id': id } }).promise()
        if (res.Item) {
            return res.Item
        }
        throw new NotFoundException()
    }

    async addPet(body: Pet): Promise<any> {
        body.id = uuidv4();
        body.dayOfRegistration = moment().toISOString()
        if (body.birthDay) body.birthDay = moment(body.birthDay).toISOString()
        body.alerts = []
        body.breathingFrequency = {
            "variable": "Frecuencia respiratoria",
            "status": "",
            "minimum": 0,
            "maximum": 0,
            "average": 0,
            "todayHistory": [],
            "history": []
        }
        body.heartRate = {
            "variable": "Ritmo cardiaco",
            "status": "",
            "minimum": 0,
            "maximum": 0,
            "average": 0,
            "todayHistory": [],
            "history": []
        }
        body.recommendations = []
        body.sound = {
            "variable": "Sonido",
            "status": "",
            "minimum": 0,
            "maximum": 0,
            "average": 0,
            "todayHistory": [],
            "history": []
        }
        body.temperature = {
            "variable": "Temperatura",
            "status": "",
            "minimum": 0,
            "maximum": 0,
            "average": 0,
            "todayHistory": [],
            "history": []
        }
        let params = {
            TableName: this.tableName,
            Item: body
        }
        await this.ddb.put(params).promise()
        return { "message": "sucess", "id": body.id }
    }

    async updatePet(id: string, pet: Pet): Promise<any> {
        if (pet.birthDay) pet.birthDay = moment(pet.birthDay).toISOString()
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
            UpdateExpression: query,
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
    async updatePetStadistic(id: string, body: Stadistics): Promise<any> {
        const res = await this.ddb.get({ TableName: this.tableName, Key: { 'id': id } }).promise()
        if (res.Item) {
            const pet = res.Item
            let query = "set "
            let keys = Object.keys(body)
            for (let index = 0; index < keys.length; index++) {
                let variable = keys[index];
                query += `${variable} = :${variable}`

                if (index < keys.length - 1) {
                    query += ','
                }
            }
            const today = moment().set({ minute: 0, second: 0, millisecond: 0, hour: 0 })
            if (body.breathingFrequency) {
                let stadistic = pet.breathingFrequency // !!!

                stadistic.todayHistory.push({
                    value: body.breathingFrequency, //!!
                    timestamp: moment().unix()
                })
                if (stadistic.todayHistory.length > this.intervalMax) {
                    stadistic.todayHistory.splice(0, 1)
                }
                let newDay = today.unix() != moment.unix(stadistic.todayHistory[0].timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix()
               
                let min = stadistic.todayHistory[0].value
                let max = stadistic.todayHistory[0].value
                let average = 0
                for (let i = 0; i < stadistic.todayHistory.length; i++) {
                    if (min > stadistic.todayHistory[i].value)
                        min = stadistic.todayHistory[i].value
                    if (max < stadistic.todayHistory[i].value)
                        max = stadistic.todayHistory[i].value
                    average += stadistic.todayHistory[i].value
                }
                average = average / stadistic.todayHistory.length
                if (newDay ||stadistic.todayHistory.length == 1 ) {
                    stadistic.history.push({
                        value: body.breathingFrequency, // !!
                        timestamp: today.unix()
                    })
                }
                else if(!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            if (body.heartRate) {
                let stadistic = pet.heartRate // !!!

                stadistic.todayHistory.push({
                    value: body.heartRate, //!!
                    timestamp: moment().unix()
                })
                if (stadistic.todayHistory.length > this.intervalMax) {
                    stadistic.todayHistory.splice(0, 1)
                }
                let newDay = today.unix() != moment.unix(stadistic.todayHistory[0].timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix()
               
                let min = stadistic.todayHistory[0].value
                let max = stadistic.todayHistory[0].value
                let average = 0
                for (let i = 0; i < stadistic.todayHistory.length; i++) {
                    if (min > stadistic.todayHistory[i].value)
                        min = stadistic.todayHistory[i].value
                    if (max < stadistic.todayHistory[i].value)
                        max = stadistic.todayHistory[i].value
                    average += stadistic.todayHistory[i].value
                }
                average = average / stadistic.todayHistory.length
                if (newDay ||stadistic.todayHistory.length == 1 ) {
                    stadistic.history.push({
                        value: body.heartRate, // !!
                        timestamp: today.unix()
                    })
                }
                else if(!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            if (body.sound) {
                let stadistic = pet.sound // !!!

                stadistic.todayHistory.push({
                    value: body.sound, //!!
                    timestamp: moment().unix()
                })
                if (stadistic.todayHistory.length > this.intervalMax) {
                    stadistic.todayHistory.splice(0, 1)
                }
                let newDay = today.unix() != moment.unix(stadistic.todayHistory[0].timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix()
               
                let min = stadistic.todayHistory[0].value
                let max = stadistic.todayHistory[0].value
                let average = 0
                for (let i = 0; i < stadistic.todayHistory.length; i++) {
                    if (min > stadistic.todayHistory[i].value)
                        min = stadistic.todayHistory[i].value
                    if (max < stadistic.todayHistory[i].value)
                        max = stadistic.todayHistory[i].value
                    average += stadistic.todayHistory[i].value
                }
                average = average / stadistic.todayHistory.length
                if (newDay ||stadistic.todayHistory.length == 1 ) {
                    stadistic.history.push({
                        value: body.sound, // !!
                        timestamp: today.unix()
                    })
                }
                else if(!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            if (body.temperature) {
                let stadistic = pet.temperature // !!!

                stadistic.todayHistory.push({
                    value: body.temperature, //!!
                    timestamp: moment().unix()
                })
                if (stadistic.todayHistory.length > this.intervalMax) {
                    stadistic.todayHistory.splice(0, 1)
                }
                let newDay = today.unix() != moment.unix(stadistic.todayHistory[0].timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix()
               
                let min = stadistic.todayHistory[0].value
                let max = stadistic.todayHistory[0].value
                let average = 0
                for (let i = 0; i < stadistic.todayHistory.length; i++) {
                    if (min > stadistic.todayHistory[i].value)
                        min = stadistic.todayHistory[i].value
                    if (max < stadistic.todayHistory[i].value)
                        max = stadistic.todayHistory[i].value
                    average += stadistic.todayHistory[i].value
                }
                average = average / stadistic.todayHistory.length
                if (newDay ||stadistic.todayHistory.length == 1 ) {
                    stadistic.history.push({
                        value: body.temperature, // !!
                        timestamp: today.unix()
                    })
                }
                else if(!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            let params = {
                TableName: this.tableName,
                Key: {
                    "id": id
                },
                UpdateExpression: query,
                ExpressionAttributeValues: {
                    ":heartRate": pet.heartRate,
                    ":breathingFrequency": pet.breathingFrequency,
                    ":sound": pet.sound,
                    ":temperature": pet.temperature,
                },
                ReturnValues: "UPDATED_NEW"
            };
            await this.ddb.update(params).promise();
            return res.Item
        }
        throw new NotFoundException()
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
