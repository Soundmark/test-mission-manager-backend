import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'team' })
export class Team {
  @Prop()
  name: string;
}

export type TeamDocument = HydratedDocument<Team>;

export const TeamSchema = SchemaFactory.createForClass(Team);
