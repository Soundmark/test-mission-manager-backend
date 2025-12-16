import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'mission' })
export class Mission {
  @Prop()
  mrId: number;

  @Prop()
  mrTitle: string;

  @Prop()
  sourceMemberId: Types.ObjectId;

  @Prop()
  targetMemberId: Types.ObjectId;

  @Prop()
  assignee: Types.ObjectId;

  @Prop()
  giturl: string;

  @Prop()
  sourceBranch: string;

  @Prop()
  targetBranch: string;

  @Prop()
  createTime: string;

  @Prop()
  updateTime: string;

  @Prop()
  status: string; // prepare, open, close, abnormal

  @Prop()
  remark: string;

  @Prop()
  teamId: string;

  @Prop()
  closeReason: string;
}

export type MissionDocument = HydratedDocument<Mission>;

export const MissionScheme = SchemaFactory.createForClass(Mission);
