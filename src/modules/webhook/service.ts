import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model, Types } from 'mongoose';
import { getTime } from 'src/utils/time';
import { Member } from '../database/schemas/member';
import { Mission } from '../database/schemas/mission';
import { NotificationService } from '../notification/service';
import { MergeRequestDto, MissionDto } from './dto';
import { ProjectMember } from './type';

@Injectable()
export class WebhookService {
  constructor(
    private notificationService: NotificationService,
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Mission.name) private missionModel: Model<Mission>,
  ) {}

  async getProjectMembers(projectId: string) {
    const res = await axios.get<ProjectMember[]>(
      `http://git.tsintergy.com:8070/api/v4/projects/${projectId}/members/all`,
      { headers: { 'PRIVATE-TOKEN': 'z-io7wpoXa89iCc4QUTF' } },
    );
    return res.data;
  }

  async gitlab(body: MergeRequestDto, teamId: string) {
    if (body.object_attributes.action === 'open') {
      const teamMembers = await this.memberModel
        .find({
          teamIds: new Types.ObjectId(teamId),
        })
        .lean();
      let projectMembers: typeof teamMembers = [];
      const teamMemberObj = Object.fromEntries(
        teamMembers.map((item) => [item.username, item]),
      );
      try {
        projectMembers = (await this.getProjectMembers(body.project.id))
          .filter((item) =>
            teamMembers.find(
              (ele) =>
                ele.username === item.username &&
                item.username !== body.user.username,
            ),
          )
          .map((item) => ({
            ...teamMemberObj[item.username],
          }));
      } catch (e) {
        console.error(e);
      }
      const sourceMember = teamMembers.find(
        (item) => item.username === body.user.username,
      );
      if (!sourceMember) {
        throw new Error('团队中找不到发起成员');
      }
      let targetMember: typeof sourceMember;
      if (
        projectMembers.length &&
        projectMembers.find((item) => item.level <= sourceMember.level)
      ) {
        // 在projectMembers中按照用户等级和空闲度分配
        const preAssigneeList = projectMembers.filter(
          (item) => item.level <= sourceMember.level,
        );
        const random = Math.floor(Math.random() * preAssigneeList.length);
        // todo 查看空闲度
        targetMember = preAssigneeList[random];
      } else if (
        teamMembers.length &&
        teamMembers.find((item) => item.level <= sourceMember.level)
      ) {
        // 在teamMembers中按照用户等级和空闲度分配
        const preAssigneeList = teamMembers.filter(
          (item) => item.level <= sourceMember.level,
        );
        const random = Math.floor(Math.random() * preAssigneeList.length);
        // todo 查看空闲度
        targetMember = preAssigneeList[random];
      } else {
        // 如果找不到合适的任务分配人，将任务指给发起人自己处理
        targetMember = sourceMember;
      }

      const createTime = getTime();
      await this.missionModel.create([
        {
          mrId: body.object_attributes.id,
          mrTitle: body.object_attributes.title,
          sourceMemberId: sourceMember._id,
          targetMemberId: targetMember._id,
          mrInvolvers: [body.user.username],
          giturl: body.project.web_url,
          sourceBranch: body.object_attributes.source_branch,
          targetBranch: body.object_attributes.target_branch,
          createTime,
          updateTime: createTime,
          status: 'prepare',
          teamId,
        },
      ]);
      this.notificationService.sendMessage(
        [sourceMember._id.toString(), targetMember._id.toString()],
        {
          type: 'mission',
          msg: `新任务${body.object_attributes.id}`,
        },
      );
    } else if (body.object_attributes.action === 'close') {
      const mission = await this.missionModel.findOne({
        mrId: body.object_attributes.id,
      });
      if (mission) {
        await mission.updateOne({
          updateTime: getTime(),
          status: 'abnormal',
          $addToSet: { mrInvolvers: body.user.username },
        });
        this.notificationService.sendMessage(
          [
            mission.sourceMemberId.toString(),
            mission.targetMemberId.toString(),
          ],
          {
            type: 'mission',
            msg: `任务${mission.mrId}异常关闭`,
          },
        );
      } else {
        throw new Error('找不到任务');
      }
    } else if (body.object_attributes.action === 'merge') {
      const mission = await this.missionModel.findOne({
        mrId: body.object_attributes.id,
      });
      if (mission) {
        await mission.updateOne({
          $set: {
            updateTime: getTime(),
            status: mission.assessment ? 'finish' : 'prefinish',
          },
          $addToSet: { mrInvolvers: body.user.username },
        });
        this.notificationService.sendMessage(
          [
            mission.sourceMemberId.toString(),
            mission.targetMemberId.toString(),
          ],
          {
            type: 'mission',
            msg: `任务${mission.mrId}${mission.assessment ? '完成' : '待评价'}`,
          },
        );
      } else {
        throw new Error('找不到任务');
      }
    } else if (body.object_attributes.action === 'update') {
      const mission = await this.missionModel.findOne({
        mrId: body.object_attributes.id,
      });
      if (mission) {
        await mission.updateOne({
          updateTime: getTime(),
          $addToSet: { mrInvolvers: body.user.username },
        });
        this.notificationService.sendMessage(
          [
            mission.sourceMemberId.toString(),
            mission.targetMemberId.toString(),
          ],
          {
            type: 'mission',
            msg: `任务${mission.mrId}更新`,
          },
        );
      } else {
        throw new Error('找不到任务');
      }
    }
  }

  async updateMission(body: MissionDto) {
    const mission = await this.missionModel.findOne({ mrId: body.mrId });
    if (mission) {
      await mission.updateOne({ ...body, updateTime: getTime() });
      this.notificationService.sendMessage(
        [mission.sourceMemberId.toString(), mission.targetMemberId.toString()],
        {
          type: 'mission',
          msg: `任务${mission.mrId}更新`,
        },
      );
    } else {
      throw new Error('找不到任务');
    }
  }
}
