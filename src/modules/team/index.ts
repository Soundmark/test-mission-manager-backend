import { Module } from '@nestjs/common';
import { TeamController } from './controller';
import { TeamService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team';
import { Member, MemberSchema } from './schemas/member';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
