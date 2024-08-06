import {
  ListProjectRequestForUserQueryParams,
  ProjectWithLimits,
  SeekPage,
  SwitchProjectResponse,
} from '@activepieces/shared';

import { api } from '@/lib/api';
import { authenticationSession } from '@/lib/authentication-session';

export const projectApi = {
  current: async () => {
    return projectApi.get(authenticationSession.getProjectId());
  },
  list(request: ListProjectRequestForUserQueryParams) {
    return api.get<SeekPage<ProjectWithLimits>>('/v1/users/projects', request);
  },
  get: async (projectId: string) => {
    return api.get<ProjectWithLimits>(`/v1/users/projects/${projectId}`);
  },
  update: async (projectId: string, request: any) => {
    return api.post<ProjectWithLimits>(`/v1/projects/${projectId}`, request);
  },
  getTokenForProject: async (projectId: string) => {
    return api.post<SwitchProjectResponse>(
      `/v1/users/projects/${projectId}/token`,
      {
        projectId,
      },
    );
  },
};
