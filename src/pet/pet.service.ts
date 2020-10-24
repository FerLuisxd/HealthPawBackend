import { Injectable, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import { Pet, Stadistics } from './pet.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment'
import * as momentTimeZone from 'moment-timezone'
import { Cron } from '@nestjs/schedule';
import * as admin from 'firebase-admin';

@Injectable()
export class PetService {
    ddb: AWS.DynamoDB.DocumentClient;
    tableName: string = "pet";
    intervalMax: Number
    maxBreathingValue: Number
    maxSoundValue: Number
    maxTemperatureValue: Number
    maxHeartRateValue: Number
    constructor() {
        this.ddb = new AWS.DynamoDB.DocumentClient();
        this.intervalMax = 24 * 60 * 60 / 20
        this.maxBreathingValue = 35
        this.maxSoundValue = 70
        this.maxTemperatureValue = 39
        this.maxHeartRateValue = 106
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
                ":weight": pet.weight,
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
                ":physicalActivity": pet.physicalActivity,
                ":recommendations": pet.recommendations
            },
            ReturnValues: "UPDATED_NEW"
        };
        await this.ddb.update(params).promise();
        return { "message": "sucess" };
    }

    modifyArray(stadistic, today) {
        stadistic.todayHistory = stadistic.todayHistory.filter(function (x) {
            return moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix()
        })
        let newDay = today.unix() != moment.unix(stadistic.todayHistory[0].timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix()

        let min = stadistic.todayHistory[0].value || 0
        let max = stadistic.todayHistory[0].value || 0
        let average = 0
        for (let i = 0; i < stadistic.todayHistory.length; i++) {
            if (min > stadistic.todayHistory[i].value)
                min = stadistic.todayHistory[i].value
            if (max < stadistic.todayHistory[i].value)
                max = stadistic.todayHistory[i].value
            average += stadistic.todayHistory[i].value
        }
        average = average / stadistic.todayHistory.length
        if (!newDay) {
            //Add to todayHistory
            let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
            stadistic.history[historyIndex].value = average
        }
        stadistic.minimum = min
        stadistic.maximum = max
        stadistic.average = average

        return stadistic
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
                let _breath = 0
                if (typeof body.breathingFrequency === 'string') {
                    _breath = Number(body.breathingFrequency)
                } else {
                    _breath = body.breathingFrequency
                }
                let stadistic = pet.breathingFrequency // !!!

                stadistic.todayHistory.push({
                    value: _breath, //!!
                    timestamp: moment().unix()
                })
                stadistic.todayHistory = stadistic.todayHistory.filter(function (x) {
                    return moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix()
                })
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
                if (newDay || stadistic.todayHistory.length == 1) {
                    stadistic.history.push({
                        value: _breath, // !!
                        timestamp: today.unix()
                    })
                }
                else if (!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            if (body.heartRate) {
                let _hearth = 0
                if (typeof body.heartRate === 'string') {
                    _hearth = Number(body.heartRate)
                } else {
                    _hearth = body.heartRate
                }
                let stadistic = pet.heartRate // !!!

                stadistic.todayHistory.push({
                    value: _hearth, //!!
                    timestamp: moment().unix()
                })
                stadistic.todayHistory = stadistic.todayHistory.filter(function (x) {
                    return moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix()
                })
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
                if (newDay || stadistic.todayHistory.length == 1) {
                    stadistic.history.push({
                        value: _hearth, // !!
                        timestamp: today.unix()
                    })
                }
                else if (!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            if (body.sound) {
                let _sound = 0
                if (typeof body.sound === 'string') {
                    _sound = Number(body.sound)
                } else {
                    _sound = body.sound
                }
                let stadistic = pet.sound // !!!

                stadistic.todayHistory.push({
                    value: _sound, //!!
                    timestamp: moment().unix()
                })
                stadistic.todayHistory = stadistic.todayHistory.filter(function (x) {
                    return moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix()
                })
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
                if (newDay || stadistic.todayHistory.length == 1) {
                    stadistic.history.push({
                        value: _sound, // !!
                        timestamp: today.unix()
                    })
                }
                else if (!newDay) {
                    //Add to todayHistory
                    let historyIndex = stadistic.history.findIndex(x => moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix())
                    stadistic.history[historyIndex].value = average
                }
                stadistic.minimum = min
                stadistic.maximum = max
                stadistic.average = average
            }
            if (body.temperature) {
                let _temperature = 0
                if (typeof body.temperature === 'string') {
                    _temperature = Number(body.temperature)
                } else {
                    _temperature = body.temperature
                }
                let stadistic = pet.temperature // !!!

                stadistic.todayHistory.push({
                    value: _temperature, //!!
                    timestamp: moment().unix()
                })
                stadistic.todayHistory = stadistic.todayHistory.filter(function (x) {
                    return moment.unix(x.timestamp).set({ minute: 0, second: 0, millisecond: 0, hour: 0 }).unix() == today.unix()
                })

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
                if (newDay || stadistic.todayHistory.length == 1) {
                    stadistic.history.push({
                        value: _temperature, // !!
                        timestamp: today.unix()
                    })
                }
                else if (!newDay) {
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

    @Cron('0 0 0 * * *', { 'timeZone': 'America/Lima' })
    async cronJobHours() {
        const today = momentTimeZone().tz('America/Lima').set({ minute: 0, second: 0, millisecond: 0, hour: 0 })
        let pets = await this.getPets()
        for (let i = 0; i < pets.length; i++) {
            let current = pets[i]
            let obj = new Pet()
            current.breathingFrequency = this.modifyArray(current.breathingFrequency, today)
            obj.breathingFrequency = current.breathingFrequency
            current.temperature = this.modifyArray(current.temperature, today)
            obj.temperature = current.temperature
            current.sound = this.modifyArray(current.sound, today)
            obj.sound = current.sound
            current.heartRate = this.modifyArray(current.heartRate, today)
            obj.heartRate = current.heartRate

            await this.updatePet(current.id, obj)
        }
    }

    async sendNotificationsToUsers(alarms, arrayOfUsers, pet) {
        // (TODO) Modificar Aqui
        let title = `Ten cuidado con ${pet.namevar}`;
        let message = `${alarms.breathingAlarm ? 'Frecuencia respiratoria fuera de rango\n' : ''}${alarms.temperatureAlarm ? 'Temperatura fuera de rango\n' : ''}${alarms.soundAlarm ? 'Sonido fuera de rango\n' : ''}${alarms.heartRateAlarm ? 'Frecuencia cardiaca fuera de rango\n' : ''}`;
        let tokens = []
        for (let i = 0; i < arrayOfUsers.length; i++) {
            if (arrayOfUsers[i].fmcToken) {
                tokens.push(arrayOfUsers[i].fmcToken);
            }
        }
        
        admin.messaging().sendMulticast({
            tokens: tokens,
            notification: {
                title: title,
                body: message,
            },
        });
    }

    @Cron('0 */15 * * * *', { 'timeZone': 'America/Lima' })
    async cronJobEvery15() {
        // Esto no escala bien, muchos fors, desventaja ALTA de DynamoDB, recomendacion cambiar a Mongo para queries compelejas.
        try {
            let pets = await this.getPets()
            let trueValue = true

            let users = (await this.ddb.scan({ TableName: "user" }).promise()).Items;
            for (let i = 0; i < pets.length; i++) {
                let current = pets[i]
                let breathingAlarm
                let temperatureAlarm
                let soundAlarm
                let heartRateAlarm
                let breathingIndex = current.breathingFrequency.todayHistory ? current.breathingFrequency.todayHistory.findIndex(x => x.value > this.maxBreathingValue && (x.reported === undefined || x.reported === false)) : -1
                if (breathingIndex != -1) {
                    pets[i].breathingFrequency.todayHistory[breathingIndex].reported = trueValue
                    breathingAlarm = current.breathingFrequency.todayHistory[breathingIndex]
                }
                let temperatureIndex = current.temperature.todayHistory ? current.temperature.todayHistory.findIndex(x => x.value > this.maxTemperatureValue && (x.reported === undefined || x.reported === false)) : -1
                if (temperatureIndex != -1) {
                    pets[i].temperature.todayHistory[temperatureIndex].reported = trueValue
                    temperatureAlarm = current.temperature.todayHistory[temperatureIndex]
                }
                let soundIndex = current.sound.todayHistory ? current.sound.todayHistory.findIndex(x => x.value > this.maxSoundValue && (x.reported === undefined || x.reported === false)) : -1
                if (soundIndex != -1) {
                    pets[i].sound.todayHistory[soundIndex].reported = trueValue
                    soundAlarm = current.sound.todayHistory[soundIndex]
                }
                let heartRateIndex = current.temperature.todayHistory ? current.temperature.todayHistory.findIndex(x => x.value > this.maxHeartRateValue && (x.reported === undefined || x.reported === false)) : -1
                if (heartRateIndex != -1) {
                    pets[i].heartRate.todayHistory[heartRateIndex].reported = trueValue
                    heartRateAlarm = current.heartRate.todayHistory[heartRateIndex]
                }

                if (breathingAlarm || temperatureAlarm || soundAlarm || heartRateAlarm) {
                    // Buscamos relacion
                    let arrayUsersWithPet = []
                    for (let j = 0; j < users.length; j++) {
                        let petFound = users[j].pets.find((x) => x.id === current.id)
                        if (petFound) {
                            arrayUsersWithPet.push(users[j])
                        }
                    }
                    
                    let alarms = {
                        breathingAlarm,
                        temperatureAlarm,
                        soundAlarm,
                        heartRateAlarm
                    }
                    if (arrayUsersWithPet.length > 0) {
                        this.sendNotificationsToUsers(alarms, arrayUsersWithPet, current)
                    }
                    // this.updatePet(current._id,pets[i])
                }

            }
        }
        catch (e) {
            console.log('ERROR CRONJOB', e)
        }

    }

}
