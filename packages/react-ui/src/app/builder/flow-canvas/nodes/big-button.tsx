import { Handle, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

const ApBigButton = React.memo(() => {
  return (
    <>
      <div className="h-[50px] w-[50px] border border-solid border-none flex items-center justify-center ">
        <div className="w-[50px] h-[50px] bg-accent rounded">
          <Button variant="ghost" className="w-full h-full">
            <Plus className="w-6 h-6 text-accent-foreground" />
          </Button>
        </div>
      </div>

      <Handle type="source" style={{ opacity: 0 }} position={Position.Right} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
    </>
  );
});

ApBigButton.displayName = 'ApBigButton';
export { ApBigButton };
