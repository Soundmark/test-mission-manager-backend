import { Controller, Get } from '@nestjs/common';

@Controller('team')
export class TeamController {
  @Get('/create')
  createTeam() {}

  @Get('/delete')
  deleteTeam() {}

  @Get('/addMember')
  addMember() {}

  @Get('/deleteMember')
  deleteMember() {}
}
