import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './modules/notification';
import { TeamModule } from './modules/team';
import { WebhookModule } from './modules/webhook';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test-mission-manager'),
    NotificationModule,
    WebhookModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
