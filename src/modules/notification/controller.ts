import { Controller, Header, Req, Sse } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { finalize, Observable } from 'rxjs';
import { Message } from './dto';
import { NotificationService } from './service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Sse('/sse/:memberId')
  @ApiOkResponse({ type: Message })
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET')
  sse(@Req() req: Request): Observable<Message> {
    const memberId = req.params.memberId;
    const { connectId, stream$ } =
      this.notificationService.createConnection(memberId);

    return stream$.pipe(
      finalize(() => {
        this.notificationService.removeConnection(memberId, connectId);
        console.log(
          `disconnected, memberId=${memberId} connectId=${connectId}`,
        );
      }),
    );
  }
}
