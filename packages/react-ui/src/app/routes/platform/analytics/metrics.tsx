import { t } from 'i18next';
import { Building, User, Workflow, Puzzle, Bot } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonList } from '@/components/ui/skeleton';
import { AnalyticsReportResponse } from '@activepieces/shared';

import { InfoTooltip } from '../../../../components/ui/info-tooltip';

import { LongNumber } from './long-number';

type MetricProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number;
  description: string;
  footer?: string;
  iconColor: string;
};

const Metric = ({
  icon: Icon,
  title,
  value,
  description,
  footer,
  iconColor,
}: MetricProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          <InfoTooltip>{description}</InfoTooltip>
        </div>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          <LongNumber value={value}></LongNumber>
        </div>
        {footer && (
          <div className="text-sm text-muted-foreground mt-2">{footer}</div>
        )}
      </CardContent>
    </Card>
  );
};

type MetricsProps = {
  report?: AnalyticsReportResponse;
};

export function Metrics({ report }: MetricsProps) {
  const metricsData = report
    ? [
        {
          icon: Workflow,
          title: t('Active Flows'),
          value: report.activeFlows,
          description: t('The number of enabled flows in the platform'),
          footer: report ? `Out of ${report.totalFlows} total flows` : null,
          iconColor: 'text-cyan-700',
        },
        {
          icon: Building,
          title: t('Active Projects'),
          value: report.activeProjects,
          description: t(
            'The number of projects with at least one enabled flow',
          ),
          footer: report
            ? `Out of ${report.totalProjects} total projects`
            : null,
          iconColor: 'text-pink-700',
        },
        {
          icon: User,
          title: t('Active Users'),
          value: report.activeUsers,
          description: t('The number of users logged in the last 30 days'),
          footer: report
            ? t(`Out of {totalusers} total users`, {
                totalusers: report.totalUsers,
              })
            : null,
          iconColor: 'text-indigo-700',
        },
        {
          icon: Puzzle,
          title: t('Pieces Used'),
          value: report.uniquePiecesUsed,
          description: t(
            'The number of unique pieces used across all active flows',
          ),
          iconColor: 'text-green-700',
        },
        {
          icon: Bot,
          title: t('Flows with AI'),
          value: report.activeFlowsWithAI,
          description: t('The number of active flows that use AI pieces'),
          iconColor: 'text-purple-700',
        },
      ]
    : [];

  return (
    <div>
      <div className="text-xl font-semibold ">{t('Metrics')}</div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {report ? (
          metricsData.map((metric, index) => (
            <Metric
              key={index}
              icon={metric.icon}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              footer={metric.footer ?? undefined}
              iconColor={metric.iconColor}
            />
          ))
        ) : (
          <SkeletonList numberOfItems={5} className="h-[138px]"></SkeletonList>
        )}
      </div>
    </div>
  );
}
