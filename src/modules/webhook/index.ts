import { Module } from '@nestjs/common';
import { WebhookController } from './controller';
import { WebhookService } from './service';
import { NotificationModule } from '../notification';

@Module({
  imports: [NotificationModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
