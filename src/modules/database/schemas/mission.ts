import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'mission' })
export class Mission {
  @Prop()
  mrId: number;

  @Prop()
  mrTitle: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  sourceMemberId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  targetMemberId: Types.ObjectId;

  @Prop()
  mrInvolvers: string[];

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

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  teamId: Types.ObjectId;

  @Prop()
  closeReason: string;
}

export type MissionDocument = HydratedDocument<Mission>;

export const MissionScheme = SchemaFactory.createForClass(Mission);
