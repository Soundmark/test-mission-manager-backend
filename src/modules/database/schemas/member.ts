import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'member' })
export class Member {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop({ type: Types.ObjectId })
  teamId: Types.ObjectId;

  @Prop()
  level: number;

  @Prop()
  email: string;

  @Prop()
  needCertificate: boolean;

  @Prop()
  password: string;
}

export type MemberDocument = HydratedDocument<Member>;

export const MemberSchema = SchemaFactory.createForClass(Member);
