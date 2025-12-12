import { Team, TeamSchema } from './schemas/team';
import { Member, MemberSchema } from './schemas/member';
import { Mission, MissionScheme } from './schemas/mission';

export const teamFeature = { name: Team.name, schema: TeamSchema };
export const memberFeature = { name: Member.name, schema: MemberSchema };
export const missionFeature = { name: Mission.name, schema: MissionScheme };
