import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './utils/allExeptionsFilter';
import * as AWS from "aws-sdk"
import * as admin from 'firebase-admin';

import * as serviceAccount from "./config/firebasekey.json";

async function bootstrap() {
  try {
    AWS.config.update({ region: 'us-east-2' });
    console.log(process.env.AWS_ACCESS_KEY_ID)
    console.log("Access key:", AWS.config.credentials);
    console.log("Region: ", AWS.config.region);
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
      }),
      databaseURL: "https://healthpaw-63e98.firebaseio.com"
    });
    console.log("Firebase: ", "Firebase Started");
  } catch (error) {
    console.log('error',error)
  }


  const app = await NestFactory.create(AppModule);
  const name = 'AppToShare'
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(name)
    .setDescription(`The ${name} API description`)
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document, {
    customCssUrl: 'https://raw.githubusercontent.com/ostranme/swagger-ui-themes/develop/themes/3.x/theme-monokai.css'
  });

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
