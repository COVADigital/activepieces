import { t } from 'i18next';
import { Check } from 'lucide-react';
import React from 'react';

type AlertOptionsProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
};

const AlertOption = React.memo(
  ({ title, description, icon, isActive, onClick }: AlertOptionsProps) => {
    return (
      <div
        onClick={onClick}
        className={`-mx-2 flex cursor-pointer items-center space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground ${
          isActive ? 'bg-secondary text-secondary-foreground' : ''
        }`}
      >
        {icon}
        <div className="flex-grow space-y-1">
          <p className="text-sm font-medium leading-none">{t(title)}</p>
          <p className="text-sm text-muted-foreground">{t(description)}</p>
        </div>
        <div>
          {isActive && <Check className="mr-2 size-4 text-muted-foreground" />}
        </div>
      </div>
    );
  },
);

AlertOption.displayName = 'AlertOption';
export { AlertOption };
