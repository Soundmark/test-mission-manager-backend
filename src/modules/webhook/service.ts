import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import dayjs from 'dayjs';
import { Model, Types } from 'mongoose';
import { Member } from '../database/schemas/member';
import { Mission } from '../database/schemas/mission';
import { MergeRequestDto } from './dto';
import { ProjectMember } from './type';

@Injectable()
export class WebhookService {
  constructor(
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
    const teamMembers = await this.memberModel
      .find({
        teamId: new Types.ObjectId(teamId),
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
    console.log(projectMembers, teamMembers);
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
      const random = Math.round(Math.random() * preAssigneeList.length);
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
      const random = Math.round(Math.random() * preAssigneeList.length);
      targetMember = preAssigneeList[random];
    } else {
      // 如果找不到合适的任务分配人，将任务指给发起人自己处理
      targetMember = sourceMember;
    }

    const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await this.missionModel.create([
      {
        mrId: body.object_attributes.id,
        mrTitle: body.object_attributes.title,
        sourceMemberId: sourceMember._id,
        targetMemberId: targetMember._id,
        assignee: sourceMember._id,
        giturl: body.project.web_url,
        sourceBranch: body.object_attributes.source_branch,
        targetBranch: body.object_attributes.target_branch,
        createTime,
        updateTime: createTime,
        status: 'prepare',
      },
    ]);
  }
}
