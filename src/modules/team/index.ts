import { Module } from '@nestjs/common';
import { TeamController } from './controller';
import { TeamService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { memberFeature, teamFeature } from '../database';

@Module({
  imports: [MongooseModule.forFeature([teamFeature, memberFeature])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
