import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { memberFeature, missionFeature } from '../database';
import { NotificationModule } from '../notification';
import { WebhookController } from './controller';
import { WebhookService } from './service';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([memberFeature, missionFeature]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
