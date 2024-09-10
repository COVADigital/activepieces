import { t } from 'i18next';
import {
  Bell,
  GitBranch,
  Puzzle,
  Settings,
  SunMoon,
  Users,
} from 'lucide-react';

import SidebarLayout from '@/app/components/sidebar-layout';
import { platformHooks } from '@/hooks/platform-hooks';

const iconSize = 20;

const sidebarNavItems = [
  {
    title: t('General'),
    href: '/settings/general',
    icon: <Settings size={iconSize} />,
  },
  {
    title: t('Appearance'),
    href: '/settings/appearance',
    icon: <SunMoon size={iconSize} />,
  },
  {
    title: t('Team'),
    href: '/settings/team',
    icon: <Users size={iconSize} />,
  },
  {
    title: t('Pieces'),
    href: '/settings/pieces',
    icon: <Puzzle size={iconSize} />,
  },
  {
    title: t('Alerts'),
    href: '/settings/alerts',
    icon: <Bell size={iconSize} />,
  },
  {
    title: t('Git Sync'),
    href: '/settings/git-sync',
    icon: <GitBranch size={iconSize} />,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}
export default function ProjectSettingsLayout({
  children,
}: SettingsLayoutProps) {
  const { platform } = platformHooks.useCurrentPlatform();

  // TODO enable alerts for communityh when it is ready
  const filteredNavItems = platform.alertsEnabled
    ? sidebarNavItems
    : sidebarNavItems.filter((item) => item.title !== t('Alerts'));

  return (
    <SidebarLayout title={t('Settings')} items={filteredNavItems}>
      {children}
    </SidebarLayout>
  );
}
