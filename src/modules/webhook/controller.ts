import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mission } from '../database/schemas/mission';
import { NotificationService } from '../notification/service';
import { MergeRequestDto } from './dto';
import { WebhookService } from './service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private notificationService: NotificationService,
    private webhookService: WebhookService,
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
  ) {}

  @Get('/triggerNotification')
  triggerNotification(@Query('memberId') memberId: string) {
    this.notificationService.sendMessage(memberId, { type: 'test', data: {} });
  }

  @Post('gitlab/:teamId')
  async gitlab(@Body() body: MergeRequestDto, @Param('teamId') teamId: string) {
    await this.webhookService.gitlab(body, teamId);
  }

  @Get('getMissionList')
  async getMissionList(@Query('memberId') memberId: string) {
    const missionList = await this.missionModel
      .find({
        $or: [
          { sourceMemberId: new Types.ObjectId(memberId) },
          { targetMemberId: new Types.ObjectId(memberId) },
        ],
      })
      .lean();

    return missionList;
  }
}
