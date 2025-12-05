import { Module } from '@nestjs/common';
import { WebhookController } from './controller';
import { WebhookService } from './service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
