import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty()
  type: string;

  @ApiProperty()
  data: Record<string, any>;
}
