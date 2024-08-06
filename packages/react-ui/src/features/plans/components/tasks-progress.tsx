import React from 'react';

import { ProgressCircularComponent } from '@/components/custom/circular-progress';
import { formatUtils } from '@/lib/utils';

type TasksProgressProps = {
  usage: number;
  plan: number;
  nextBillingDate: string;
};

const TasksProgress: React.FC<TasksProgressProps> = ({
  usage,
  plan,
  nextBillingDate,
}) => {
  return (
    <div className="flex flex-row gap-6 items-center justify-center">
      <ProgressCircularComponent data={{ plan, usage }} />
      <div className="flex flex-col gap-2">
        <span className="text-md">
          {usage} of {plan} Tasks
        </span>
        <span className="text-md text-muted-foreground">
          Resets at{' '}
          {`${formatUtils.formatDate(new Date(nextBillingDate)).toUpperCase()}`}
        </span>
      </div>
    </div>
  );
};

export { ProgressCircularComponent, TasksProgress };
