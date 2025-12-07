import { ApiProperty } from '@nestjs/swagger';

export class TeamDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class MemberDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  teamId: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ description: '是否需要认证' })
  needCertificate: boolean;
}

export class MemberWithIdDto extends MemberDto {
  @ApiProperty()
  id: string;
}
