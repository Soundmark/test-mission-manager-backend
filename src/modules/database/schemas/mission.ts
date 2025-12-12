import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'mission' })
export class Mission {
  @Prop()
  mrId: number;

  @Prop()
  mrTitle: string;

  @Prop()
  sourceMemberId: string;

  @Prop()
  targetMemberId: string;

  @Prop()
  sourceBranch: string;

  @Prop()
  targetBranch: string;

  @Prop()
  createTime: string;

  @Prop()
  updateTime: string;

  @Prop()
  status: string; // prepare, open, close

  @Prop()
  remark: string;
}

export type MissionDocument = HydratedDocument<Mission>;

export const MissionScheme = SchemaFactory.createForClass(Mission);
