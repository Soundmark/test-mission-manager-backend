import { ApiProperty } from '@nestjs/swagger';

export class MergeRequestDto {
  event_type: 'merge_request';

  user: { name: string; username: string; email: string };

  project: {
    id: string;
    name: string;
    homepage: string;
    web_url: string;
  };

  object_attributes: {
    id: number;
    title: string;
    source_branch: string;
    target_branch: string;
    action:
      | 'open'
      | 'close'
      | 'merge'
      | 'update'
      | 'reopen'
      | 'approved'
      | 'unapproved'
      | 'approval'
      | 'unapproval';
  };

  assignees: {
    name: string;
    username: string;
    email: string;
  }[];
}

export class MissionDto {
  @ApiProperty()
  mrId: number;

  @ApiProperty()
  mrTitle: string;

  @ApiProperty()
  sourceMemberId: string;

  @ApiProperty()
  targetMemberId: string;

  @ApiProperty()
  assignee: string;

  @ApiProperty()
  giturl: string;

  @ApiProperty()
  sourceBranch: string;

  @ApiProperty()
  targetBranch: string;

  @ApiProperty()
  createTime: string;

  @ApiProperty()
  updateTime: string;

  @ApiProperty({ enum: ['prepare', 'open', 'close', 'abnormal'] })
  status: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  teamId: string;

  @ApiProperty()
  closeReason: string;
}
