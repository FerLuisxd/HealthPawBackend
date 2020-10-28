import { Body, Controller, Post } from '@nestjs/common';
import { GlobalNotification } from './global-notification.entity';
import { GlobalNotificationService } from './global-notification.service';

@Controller('global-notification')
export class GlobalNotificationController {
    constructor(private readonly globalNotificationService: GlobalNotificationService) { }

    @Post()
    async addPet(@Body() body: GlobalNotification) {
        return await this.globalNotificationService.addGlobalNotification(body);
    }
}
