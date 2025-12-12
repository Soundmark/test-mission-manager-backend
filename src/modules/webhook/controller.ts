import { Controller, Get, Query, Body, Post, Param } from '@nestjs/common';
import { NotificationService } from '../notification/service';
import { MergeRequestDto } from './dto';
import { WebhookService } from './service';
import { ProjectMember } from './type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member } from '../database/schemas/member';
import { Mission } from '../database/schemas/mission';

@Controller('webhook')
export class WebhookController {
  constructor(
    private notificationService: NotificationService,
    private webhookService: WebhookService,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
  ) {}

  @Get('/triggerNotification')
  triggerNotification(@Query('memberId') memberId: string) {
    this.notificationService.sendMessage(memberId, { type: 'test', data: {} });
  }

  @Post('gitlab/:teamId')
  async gitlab(@Body() body: MergeRequestDto, @Param('teamId') teamId: string) {
    let projectMembers: ProjectMember[] = [];
    const teamMembers = await this.memberModel.find({
      teamId: new Types.ObjectId(teamId),
    });
    try {
      projectMembers = (
        await this.webhookService.getProjectMembers(body.project.id)
      ).filter((item) =>
        teamMembers.find((ele) => ele.username === item.username),
      );
    } catch (e) {
      console.error(e);
    }
    console.log(projectMembers, teamMembers);
    if (projectMembers.length) {
      // 在projectMembers中按照用户等级和空闲度分配
    } else if (teamMembers.length) {
      // 在teamMembers中按照用户等级和空闲度分配
    }
  }
}
