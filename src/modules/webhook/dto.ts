export class MergeRequestDto {
  event_type: 'merge_request';

  user: { name: string; username: string; email: string };

  project: {
    id: string;
    name: string;
    homepage: string;
    url: string;
  };

  object_attributes: {
    source_branch: string;
    target_branch: string;
    action:
      | 'open'
      | 'close'
      | 'merge'
      | 'update'
      | 'reopen'
      | 'approved'
      | 'unapproved'
      | 'approval'
      | 'unapproval';
  };

  assignees: {
    name: string;
    username: string;
    email: string;
  }[];
}
