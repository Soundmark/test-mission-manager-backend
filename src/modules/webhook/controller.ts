import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { NotificationService } from '../notification/service';
import { MergeRequestDto } from './dto';
import { WebhookService } from './service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private notificationService: NotificationService,
    private webhookService: WebhookService,
  ) {}

  @Get('/triggerNotification')
  triggerNotification(@Query('memberId') memberId: string) {
    this.notificationService.sendMessage(memberId, { type: 'test', data: {} });
  }

  @Post('gitlab/:teamId')
  async gitlab(@Body() body: MergeRequestDto, @Param('teamId') teamId: string) {
    await this.webhookService.gitlab(body, teamId);
  }
}
