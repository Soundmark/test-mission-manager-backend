import { Module } from '@nestjs/common';
import { WebhookController } from './controller';
import { WebhookService } from './service';
import { NotificationModule } from '../notification';
import { MongooseModule } from '@nestjs/mongoose';
import { memberFeature, missionFeature } from '../database';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([memberFeature, missionFeature]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
