import { Controller, Req, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationService } from './service';
import type { Request } from 'express';
import { Message } from './dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Sse('/sse/:memberId')
  @ApiOkResponse({ type: Message })
  sse(@Req() req: Request): Observable<Message> {
    const memberId = req.params.memberId;
    const { connectId, stream$ } =
      this.notificationService.createConnection(memberId);

    req.on('close', () => {
      console.log(
        `sse disconnected: memberId=${memberId} connectId=${connectId}`,
      );
      this.notificationService.removeConnection(memberId, connectId);
    });

    return stream$;
  }
}
