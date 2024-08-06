import { ProjectWithLimits } from '@activepieces/shared';
import {
  useQuery,
  QueryClient,
  usePrefetchQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { projectApi } from '../lib/project-api';

import { authenticationSession } from '@/lib/authentication-session';

export const projectHooks = {
  prefetchProject: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePrefetchQuery<ProjectWithLimits, Error>({
      queryKey: ['current-project'],
      queryFn: projectApi.current,
    });
  },
  useCurrentProject: () => {
    const query = useSuspenseQuery<ProjectWithLimits, Error>({
      queryKey: ['current-project'],
      queryFn: projectApi.current,
    });
    return {
      ...query,
      project: query.data,
      updateProject,
      setCurrentProject,
    };
  },
  useProjects: () => {
    return useQuery<ProjectWithLimits[], Error>({
      queryKey: ['projects'],
      queryFn: async () => {
        const results = await projectApi.list({
          cursor: undefined,
          limit: 100,
        });
        return results.data;
      },
    });
  },
};

const updateProject = async (queryClient: QueryClient, request: any) => {
  queryClient.setQueryData(['current-project'], {
    ...queryClient.getQueryData(['current-project'])!,
    ...request,
  });
};

const setCurrentProject = async (
  queryClient: QueryClient,
  project: ProjectWithLimits,
) => {
  const projectChanged = authenticationSession.getProjectId() !== project.id;
  if (projectChanged) {
    await authenticationSession.switchToSession(project.id);
  }
  queryClient.setQueryData(['current-project'], project);
  if (projectChanged) {
    window.location.reload();
  }
};
