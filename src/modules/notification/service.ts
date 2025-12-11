import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Subject } from 'rxjs';
import { Message } from './dto';

@Injectable()
export class NotificationService {
  private members = new Map<string, Map<string, Subject<Message>>>();
  private heartbeatTimer: NodeJS.Timeout;

  createConnection(memberId: string) {
    const connectId = randomUUID();
    const subject = new Subject<Message>();
    if (!this.members.has(memberId)) {
      this.members.set(memberId, new Map());
    }
    this.members.get(memberId)!.set(connectId, subject);
    console.log(this.members);
    return { connectId, stream$: subject.asObservable() };
  }

  removeConnection(memberId: string, connectId: string) {
    const memberMap = this.members.get(memberId);
    if (memberMap) {
      const subject = memberMap.get(connectId);
      if (subject) {
        subject.complete();
        memberMap.delete(connectId);
      }
      if (memberMap.size === 0) {
        this.members.delete(memberId);
      }
    }
  }

  sendMessage(memberId: string, msg: Message) {
    const memberMap = this.members.get(memberId);
    if (memberMap) {
      for (const subject of memberMap.values()) {
        subject.next(msg);
      }
    }
  }
}
