import { Controller, Get, Query } from '@nestjs/common';
import { NotificationService } from '../notification/service';

@Controller('webhook')
export class WebhookController {
  constructor(private notificationService: NotificationService) {}

  @Get('/triggerNotification')
  triggerNotification(@Query('memberId') memberId: string) {
    this.notificationService.sendMessage(memberId, { type: 'test', data: {} });
  }
}
