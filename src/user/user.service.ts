import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as AWS from 'aws-sdk'
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import * as moment from 'moment'
@Injectable()
export class UserService {
  ddb: AWS.DynamoDB.DocumentClient
  tableName: string
  constructor() {
    this.ddb = new AWS.DynamoDB.DocumentClient();
    this.tableName = 'user'
  }
  async getUsers(): Promise<any> {
    let res = await this.ddb.scan({ TableName: 'user' }).promise()
    return res.Items
  }

  async getUser(id: string): Promise<any> {
    let response = (await this.ddb.get({ TableName: 'user', Key: { 'documentNumber': id } }).promise())
    console.log(response)
    if (response.Item) {
      response.Item.password = undefined
      return response.Item
    }
    else throw new NotFoundException()
  }
  async login(body: User): Promise<any> {
    if (!body.documentNumber) throw new BadRequestException('documentNumber is required')
    if (!body.password) throw new BadRequestException('password is required')
    let response = (await this.ddb.get({ TableName: 'user', Key: { 'documentNumber': body.documentNumber } }).promise())
    if(response.Item){
      let same = await bcrypt.compare(body.password, response.Item.password)
      if(same) return { "message": "sucess" }
      else throw new UnauthorizedException()
    }
    else throw new UnauthorizedException()
  }
  async addUser(body: User): Promise<any> {
    if (!body.documentNumber) throw new BadRequestException('documentNumber is required')
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(body.password, salt);
    body.dayofRegistration = moment().toISOString()
    body.pets = []
    if(body.birthDay) body.birthDay = moment(body.birthDay).toISOString()
    body.active = true
    body.password = hash
    let params = {
      TableName: this.tableName,
      Item: body
    }
    await this.ddb.put(params).promise()
    return { "message": "sucess" }
  }
  async updateUser(id: string, body: User): Promise<any> {
    if (body.password) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(body.password, salt);
      body.password = hash
    }
    if(body.birthDay) body.birthDay = moment(body.birthDay).toISOString()
    let query = "set "
    let keys = Object.keys(body)
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
        "documentNumber": id
      },
      UpdateExpression: query
      ,
      ExpressionAttributeValues: {
        ":birthDay": body.birthDay,
        ":active": body.active,
        ":clinic": body.clinic,
        ":email": body.email,
        ":image": body.image,
        ":lastName": body.lastName,
        ":namevar": body.namevar,
        ":password": body.password,
        ":phone": body.phone,
        ":secondLastName": body.secondLastName
      },
      ReturnValues: "UPDATED_NEW"
    };
    await this.ddb.update(params).promise();
    return { "message": "sucess" };
  }
  async addPetToUser(id: string, pet: Object): Promise<any> {
    var params = {
      TableName: this.tableName,
      Key: {
        "documentNumber": id
      },
      UpdateExpression: "set pets = list_append(pets,:p)",
      ExpressionAttributeValues: {
        ":p": [pet]
      },
      ReturnValues: "ALL_NEW"
    };

    let res = await this.ddb.update(params).promise()
    if(res.Attributes){
      res.Attributes.password = undefined
      return res.Attributes
    }
    else throw new NotFoundException()
  }
  deleteUser(id: string): any {
    return {}
  }
}
