import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model, Types } from 'mongoose';
import {
  ApiResponseArrayDto,
  ApiResponseDto,
  ApiSimpleResponseDto,
} from '../../utils/swagger';
import { Member, MemberDocument } from '../database/schemas/member';
import { Team } from '../database/schemas/team';
import { MemberDto, MemberWithIdDto, TeamDto } from './dto';

@Controller('team')
export class TeamController {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  @Post('/create')
  async createTeam(
    @Body('name') name: string,
    @Body('creator') creator: string,
  ) {
    const [newTeam] = await this.teamModel.create([
      {
        name,
        creator,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    ]);
    await this.memberModel.updateOne(
      { _id: creator },
      { $addToSet: { teamIds: newTeam._id } },
    );
  }

  @Get('/delete')
  async deleteTeam(@Query('teamId') teamId: string) {
    await this.teamModel.findByIdAndDelete(new Types.ObjectId(teamId));
  }

  @Post('/addMember')
  async addMember(@Body() body: Omit<MemberDto, 'teamIds'>) {
    const { ...rest } = body;
    await this.memberModel.create({
      ...rest,
      teamIds: [],
    });
  }

  @Post('/updateMember')
  async updateMember(@Body() body: MemberWithIdDto) {
    const { teamIds, id, ...rest } = body;
    const updateObj: Partial<MemberDocument> = { ...rest };
    if (teamIds) {
      updateObj.teamIds = teamIds.map((item) => new Types.ObjectId(item));
    }
    await this.memberModel.findByIdAndUpdate(id, updateObj);
  }

  @Get('/deleteMember')
  async deleteMember(@Query('id') id: string) {
    await this.memberModel.findByIdAndDelete(new Types.ObjectId(id));
  }

  @Get('/getTeamList')
  @ApiResponseArrayDto(TeamDto)
  async getTeamList(): Promise<TeamDto[]> {
    const list = await this.teamModel.find().lean();
    return list.map((item) => {
      const { _id, name, createTime, creator } = item;
      return { id: _id.toString(), name, createTime, creator };
    });
  }

  @Get('/getMember')
  @ApiResponseDto(MemberWithIdDto)
  async getMember(@Query('memberId') memberId: string) {
    const member = await this.memberModel.findById(memberId, { __v: 0 }).lean();
    if (member) {
      const { _id, ...rest } = member;
      return { id: _id, ...rest };
    }
  }

  @Get('/getMemberList')
  @ApiResponseArrayDto(MemberWithIdDto)
  async getMemberList(
    @Query('teamId') teamId: string,
  ): Promise<MemberWithIdDto[]> {
    let query: { teamIds?: Types.ObjectId } = {};
    if (teamId) {
      query = { teamIds: new Types.ObjectId(teamId) };
    }
    const list = await this.memberModel.find(query, { password: 0 }).lean();
    return list.map((item) => {
      const { _id, teamIds, ...rest } = item;
      return {
        id: _id.toString(),
        teamIds: teamIds.map((item) => item.toString()),
        ...rest,
      };
    });
  }

  @Post('/certificate')
  @ApiSimpleResponseDto('boolean')
  async certificate(
    @Body('id') id: string,
    @Body('password') password: string,
  ): Promise<boolean> {
    const member = await this.memberModel.findById(new Types.ObjectId(id));
    if (member?.password === password) {
      return true;
    }

    return false;
  }
}
