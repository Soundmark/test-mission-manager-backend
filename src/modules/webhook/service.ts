import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProjectMember } from './type';

@Injectable()
export class WebhookService {
  async getProjectMembers(projectId: string) {
    const res = await axios.get<ProjectMember[]>(
      `http://git.tsintergy.com:8070/api/v4/projects/${projectId}/members/all`,
      { headers: { 'PRIVATE-TOKEN': 'z-io7wpoXa89iCc4QUTF' } },
    );
    return res.data;
  }
}
