import { Navigate, createBrowserRouter } from 'react-router-dom';

import { PageTitle } from '@/app/components/page-title';
import PlatformSettingsLayout from '@/app/components/platform-settings-layout';
import ProjectSettingsLayout from '@/app/components/project-settings-layout';
import { ApiKeysPage } from '@/app/routes/platform/settings/api-keys';
import { BrandingPage } from '@/app/routes/platform/settings/branding';
import { SigningKeysPage } from '@/app/routes/platform/settings/signing-keys';
import { SSOPage } from '@/app/routes/platform/settings/sso';
import { FlowRunsPage } from '@/app/routes/runs';
import { SwitchToBetaPage } from '@/app/routes/switch-to-beta';
import { VerifyEmail } from '@/features/authentication/components/verify-email';
import { AcceptInvitation } from '@/features/team/component/accept-invitation';

import { FlowsPage } from '../app/routes/flows';

import { AllowOnlyLoggedInUserOnlyGuard } from './components/allow-logged-in-user-only-guard';
import { DashboardContainer } from './components/dashboard-container';
import { PlatformAdminContainer } from './components/platform-admin-container';
import NotFoundPage from './routes/404-page';
import { ChangePasswordPage } from './routes/change-password';
import AppConnectionsPage from './routes/connections';
import { FlowBuilderPage } from './routes/flows/id';
import { ResetPasswordPage } from './routes/forget-password';
import { FormPage } from './routes/forms';
import IssuesPage from './routes/issues';
import PlansPage from './routes/plans';
import AuditLogsPage from './routes/platform/audit-logs';
import PlatformPiecesPage from './routes/platform/pieces';
import ProjectsPage from './routes/platform/projects';
import TemplatesPage from './routes/platform/templates';
import UsersPage from './routes/platform/users';
import { FlowRunPage } from './routes/runs/id';
import AlertsPage from './routes/settings/alerts';
import AppearancePage from './routes/settings/appearance';
import GeneralPage from './routes/settings/general';
import { GitSyncPage } from './routes/settings/git-sync';
import PiecesPage from './routes/settings/pieces';
import TeamPage from './routes/settings/team';
import { SignInPage } from './routes/sign-in';
import { SignUpPage } from './routes/sign-up';
import { ShareTemplatePage } from './routes/templates/share-template';

export const router = createBrowserRouter([
  {
    // TODO remove after react is launched
    path: '/switch-to-beta',
    element: <SwitchToBetaPage />,
  },
  {
    path: '/flows',
    element: (
      <DashboardContainer>
        <PageTitle title="Flows">
          <FlowsPage />
        </PageTitle>
      </DashboardContainer>
    ),
  },
  {
    path: '/flows/:flowId',
    element: (
      <AllowOnlyLoggedInUserOnlyGuard>
        <PageTitle title="Builder">
          <FlowBuilderPage />
        </PageTitle>
      </AllowOnlyLoggedInUserOnlyGuard>
    ),
  },
  {
    path: '/forms/:flowId',
    element: (
      <PageTitle title="Forms">
        <FormPage />
      </PageTitle>
    ),
  },
  {
    path: '/runs/:runId',
    element: (
      <AllowOnlyLoggedInUserOnlyGuard>
        <PageTitle title="Flow Run">
          <FlowRunPage />
        </PageTitle>
      </AllowOnlyLoggedInUserOnlyGuard>
    ),
  },
  {
    path: '/templates/:templateId',
    element: (
      <AllowOnlyLoggedInUserOnlyGuard>
        <PageTitle title="Share Template">
          <ShareTemplatePage />
        </PageTitle>
      </AllowOnlyLoggedInUserOnlyGuard>
    ),
  },
  {
    path: '/runs',
    element: (
      <DashboardContainer>
        <PageTitle title="Runs">
          <FlowRunsPage />
        </PageTitle>
      </DashboardContainer>
    ),
  },
  {
    path: '/issues',
    element: (
      <DashboardContainer>
        <PageTitle title="Issues">
          <IssuesPage />
        </PageTitle>
      </DashboardContainer>
    ),
  },
  {
    path: '/connections',
    element: (
      <DashboardContainer>
        <PageTitle title="Connections">
          <AppConnectionsPage />
        </PageTitle>
      </DashboardContainer>
    ),
  },
  {
    path: '/plans',
    element: (
      <DashboardContainer>
        <PageTitle title="Plans">
          <PlansPage />
        </PageTitle>
      </DashboardContainer>
    ),
  },
  {
    path: '/settings',
    element: (
      <DashboardContainer>
        <Navigate to="/settings/general" replace />
      </DashboardContainer>
    ),
  },
  {
    path: '/forget-password',
    element: (
      <PageTitle title="Forget Password">
        <ResetPasswordPage />
      </PageTitle>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <PageTitle title="Reset Password">
        <ChangePasswordPage />
      </PageTitle>
    ),
  },
  {
    path: '/sign-in',
    element: (
      <PageTitle title="Sign In">
        <SignInPage />
      </PageTitle>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <PageTitle title="Verify Email">
        <VerifyEmail />
      </PageTitle>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <PageTitle title="Sign Up">
        <SignUpPage />
      </PageTitle>
    ),
  },
  {
    path: '/settings/alerts',
    element: (
      <DashboardContainer>
        <ProjectSettingsLayout>
          <PageTitle title="Alerts">
            <AlertsPage />
          </PageTitle>
        </ProjectSettingsLayout>
      </DashboardContainer>
    ),
  },
  {
    path: '/settings/appearance',
    element: (
      <DashboardContainer>
        <ProjectSettingsLayout>
          <PageTitle title="Appearance">
            <AppearancePage />
          </PageTitle>
        </ProjectSettingsLayout>
      </DashboardContainer>
    ),
  },
  {
    path: '/settings/general',
    element: (
      <DashboardContainer>
        <ProjectSettingsLayout>
          <PageTitle title="General">
            <GeneralPage />
          </PageTitle>
        </ProjectSettingsLayout>
      </DashboardContainer>
    ),
  },
  {
    path: '/settings/pieces',
    element: (
      <DashboardContainer>
        <ProjectSettingsLayout>
          <PageTitle title="Pieces">
            <PiecesPage />
          </PageTitle>
        </ProjectSettingsLayout>
      </DashboardContainer>
    ),
  },
  {
    path: '/settings/team',
    element: (
      <DashboardContainer>
        <ProjectSettingsLayout>
          <PageTitle title="Team">
            <TeamPage />
          </PageTitle>
        </ProjectSettingsLayout>
      </DashboardContainer>
    ),
  },
  {
    path: '/settings/git-sync',
    element: (
      <DashboardContainer>
        <ProjectSettingsLayout>
          <PageTitle title="Git Sync">
            <GitSyncPage />
          </PageTitle>
        </ProjectSettingsLayout>
      </DashboardContainer>
    ),
  },
  {
    path: '/invitation',
    element: (
      <PageTitle title="Accept Invitation">
        <AcceptInvitation />
      </PageTitle>
    ),
  },

  {
    path: '/404',
    element: (
      <PageTitle title="Not Found">
        <NotFoundPage />
      </PageTitle>
    ),
  },
  {
    path: '/platform/audit-logs',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Audit Logs">
          <AuditLogsPage />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/pieces',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Platform Pieces">
          <PlatformPiecesPage />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/projects',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Projects">
          <ProjectsPage />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/templates',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Templates">
          <TemplatesPage />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/users',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Users">
          <UsersPage />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Platform">
          <Navigate to="/platform/projects" />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/settings/branding',
    element: (
      <PlatformAdminContainer>
        <PlatformSettingsLayout>
          <PageTitle title="Branding">
            <BrandingPage />
          </PageTitle>
        </PlatformSettingsLayout>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/settings/api-keys',
    element: (
      <PlatformAdminContainer>
        <PlatformSettingsLayout>
          <PageTitle title="API Keys">
            <ApiKeysPage />
          </PageTitle>
        </PlatformSettingsLayout>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/settings/signing-keys',
    element: (
      <PlatformAdminContainer>
        <PlatformSettingsLayout>
          <PageTitle title="Signing Keys">
            <SigningKeysPage />
          </PageTitle>
        </PlatformSettingsLayout>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/settings/sso',
    element: (
      <PlatformAdminContainer>
        <PlatformSettingsLayout>
          <PageTitle title="SSO">
            <SSOPage />
          </PageTitle>
        </PlatformSettingsLayout>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/platform/settings',
    element: (
      <PlatformAdminContainer>
        <PageTitle title="Platform Settings">
          <Navigate to="/platform/settings/branding" replace />
        </PageTitle>
      </PlatformAdminContainer>
    ),
  },
  {
    path: '/*',
    element: (
      <PageTitle title="Redirect">
        <Navigate to="/flows" replace />
      </PageTitle>
    ),
  },
]);
