import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import { SocketProvider } from '@/components/socket-provider';
import { LoadingSpinner } from '@/components/ui/spinner';
import { flagsHooks } from '@/hooks/flags-hooks';
import { platformHooks } from '@/hooks/platform-hooks';
import { projectHooks } from '@/hooks/project-hooks';

import { authenticationSession } from '../../lib/authentication-session';

function isJwtExpired(token: string): boolean {
  if (!token) {
    return true;
  }
  try {
    const decoded = jwtDecode(token);
    if (decoded && decoded.exp && dayjs().isAfter(dayjs.unix(decoded.exp))) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
}

export const AllowOnlyLoggedInUserOnlyGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (!authenticationSession.isLoggedIn()) {
    return <Navigate to="/sign-in" replace />;
  }
  const token = authenticationSession.getToken();
  if (!token || isJwtExpired(token)) {
    authenticationSession.logOut();
    return <Navigate to="/sign-in" replace />;
  }
  projectHooks.prefetchProject();
  platformHooks.prefetchPlatform();
  flagsHooks.useFlags();
  return (
    <Suspense
      fallback={
        <div className=" flex h-screen w-screen items-center justify-center ">
          <LoadingSpinner size={50}></LoadingSpinner>
        </div>
      }
    >
      <SocketProvider>{children}</SocketProvider>
    </Suspense>
  );
};
