import { Module } from '@nestjs/common';
import { TeamController } from './controller';
import { TeamService } from './service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
