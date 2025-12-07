import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schemas/team';
import { Model, Types } from 'mongoose';
import { Member } from './schemas/member';
import { MemberDto, MemberWithIdDto, TeamDto } from './dto';
import { ApiResponseArrayDto, ApiSimpleResponseDto } from '../../utils/swagger';

@Controller('team')
export class TeamController {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  @Get('/create')
  async createTeam(@Query('name') name: string) {
    await this.teamModel.create({ name });
  }

  @Get('/delete')
  async deleteTeam(@Query('teamId') teamId: string) {
    await this.teamModel.findByIdAndDelete(new Types.ObjectId(teamId));
  }

  @Post('/addMember')
  async addMember(@Body() body: MemberDto) {
    const { teamId, ...rest } = body;
    await this.memberModel.create({
      teamId: new Types.ObjectId(teamId),
      ...rest,
    });
  }

  @Get('/deleteMember')
  async deleteMember(@Query('id') id: string) {
    await this.memberModel.findByIdAndDelete(new Types.ObjectId(id));
  }

  @Get('/getTeamList')
  @ApiResponseArrayDto(TeamDto)
  async getTeamList(): Promise<TeamDto[]> {
    const list = await this.teamModel.find();
    return list.map((item) => {
      const { _id, name } = item;
      return { id: _id.toString(), name };
    });
  }

  @Get('/getMemberList')
  @ApiResponseArrayDto(MemberWithIdDto)
  async getMemberList(
    @Query('teamId') teamId: string,
  ): Promise<MemberWithIdDto[]> {
    const list = await this.memberModel
      .find({ teamId: new Types.ObjectId(teamId) }, { password: 0 })
      .lean();
    return list.map((item) => {
      const { _id, teamId, ...rest } = item;
      return { id: _id.toString(), teamId: teamId.toString(), ...rest };
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
