import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import { GlobalNotification } from './global-notification.entity';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

@Injectable()
export class GlobalNotificationService {
    ddb: AWS.DynamoDB.DocumentClient;
    tableName: string = "globalNotification";
    constructor() {
        this.ddb = new AWS.DynamoDB.DocumentClient();
    }

    async addGlobalNotification(body: GlobalNotification): Promise<any> {
        body.id = uuidv4();
        let params = {
            TableName: this.tableName,
            Item: body
        }
        await this.ddb.put(params).promise()
        return { "message": "sucess", "id": body.id }
    }

    async sendGlobalNotification(): Promise<any> {
        let today = new Date();
        today.setSeconds(0,0);
        let users = (await this.ddb.scan({ TableName: "user" }).promise()).Items;
        let globalNotifications = (await this.ddb.scan({ TableName: "globalNotification" }).promise()).Items;
        var tokens: string[] = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].fmcToken) {
                tokens.push(users[i].fmcToken);
            }
        }
        if (tokens.length > 0) {
            for (let i = 0; i < globalNotifications.length; i++) {
                let date = new Date(globalNotifications[i].date);
                let sameYear = today.getFullYear() == date.getFullYear();
                let sameMonth = today.getMonth() == date.getMonth();
                let sameDay = today.getDay() == date.getDay();
                let sameHour = today.getHours() == date.getHours();
                let sameMinute = today.getMinutes() == date.getMinutes();
                let sameDate = sameYear && sameMonth && sameDay && sameHour && sameMinute;
                if (sameDate) {
                    const message = {
                        tokens: tokens,
                        notification: {
                            title: globalNotifications[i].title,
                            body: globalNotifications[i].body,
                        },
                      };
                    admin.messaging().sendMulticast(message);
                }
            }
        }
    }

}