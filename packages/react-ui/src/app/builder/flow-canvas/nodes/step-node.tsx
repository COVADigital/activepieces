import { useDraggable } from '@dnd-kit/core';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Handle, Position } from '@xyflow/react';
import { CircleAlert, CopyPlus, Replace, Trash } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import {
  StepPathWithName,
  builderSelectors,
  useBuilderStateContext,
} from '@/app/builder/builder-hooks';
import ImageWithFallback from '@/app/components/image-with-fallback';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { UNSAVED_CHANGES_TOAST, useToast } from '@/components/ui/use-toast';
import { flowRunUtils } from '@/features/flow-runs/lib/flow-run-utils';
import { piecesHooks } from '@/features/pieces/lib/pieces-hook';
import { cn } from '@/lib/utils';
import {
  FlowOperationType,
  FlowRun,
  StepLocationRelativeToParent,
  TriggerType,
  flowHelper,
  isNil,
} from '@activepieces/shared';

import { ApNode } from '../flow-canvas-utils';

function getStepStatus(
  stepName: string | undefined,
  selectedStep: StepPathWithName | null,
  run: FlowRun | null,
) {
  if (!run || !stepName) {
    return undefined;
  }
  const state = builderSelectors.getStepOutputFromExecutionPath({
    selectedPath: selectedStep,
    stepName,
    executionState: run,
  });
  return state?.status;
}

const ApStepNode = React.memo(({ data }: { data: ApNode['data'] }) => {
  const { toast } = useToast();
  const [
    selectStepByName,
    setAllowCanvasPanning,
    isSelected,
    isDragging,
    clickOnNewNodeButton,
    selectedStep,
    run,
  ] = useBuilderStateContext((state) => [
    state.selectStepByName,
    state.setAllowCanvasPanning,
    state.selectedStep?.stepName === data.step?.name,
    state.activeDraggingStep === data.step?.name,
    state.clickOnNewNodeButton,
    state.selectedStep,
    state.run,
  ]);

  const deleteStep = useBuilderStateContext((state) => () => {
    state.applyOperation(
      {
        type: FlowOperationType.DELETE_ACTION,
        request: {
          name: data.step!.name,
        },
      },
      () => toast(UNSAVED_CHANGES_TOAST),
    );
    state.removeStepSelection();
  });

  const duplicateStep = useBuilderStateContext((state) => () => {
    state.applyOperation(
      {
        type: FlowOperationType.DUPLICATE_ACTION,
        request: {
          stepName: data.step!.name,
        },
      },
      () => toast(UNSAVED_CHANGES_TOAST),
    );
  });

  const { stepMetadata } = piecesHooks.useStepMetadata({
    step: data.step!,
  });

  const [toolbarOpen, setToolbarOpen] = useState(false);

  const isTrigger = flowHelper.isTrigger(data.step!.type);
  const isAction = flowHelper.isAction(data.step!.type);

  const stepName = data?.step?.name;

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: data.step!.name,
    disabled: true,
  });

  const stepOutputStatus = useMemo(
    () => getStepStatus(stepName, selectedStep, run),
    [stepName, selectedStep, run],
  );
  const statusInfo = isNil(stepOutputStatus)
    ? undefined
    : flowRunUtils.getStatusIconForStep(stepOutputStatus);

  const handleStepClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { type, name } = data.step!;
    if (type === TriggerType.EMPTY) {
      clickOnNewNodeButton('trigger', name, StepLocationRelativeToParent.AFTER);
      return;
    } else {
      selectStepByName(name);
    }
    e.stopPropagation();
  };

  return (
    <div
      style={{
        boxShadow:
          (isSelected || toolbarOpen) && !isDragging
            ? 'inset 0 3px 0 hsl(var(--primary))'
            : 'none',
        borderRadius: '8px',
        borderTopColor:
          isSelected || toolbarOpen
            ? 'hsl(var(--primary))'
            : 'hsl(var(--border))',
      }}
      className={cn('h-[70px] w-[260px] transition-all border-box border', {
        'border-primary': toolbarOpen || isSelected,
        'bg-background': !isDragging,
        'border-none': isDragging,
      })}
      onClick={(e) => handleStepClick(e)}
      onMouseEnter={() => {
        setToolbarOpen(true);
        setAllowCanvasPanning(false);
      }}
      onMouseLeave={() => {
        setToolbarOpen(false);
        setAllowCanvasPanning(true);
      }}
      key={data.step!.name}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div className="px-2 h-full w-full">
        {!isDragging && (
          <>
            <div
              className={cn(
                'w-[40px] h-[70px] absolute right-[-50px] top-[20px] transition-opacity duration-300',
                {
                  'opacity-0': !toolbarOpen,
                  'opacity-100': toolbarOpen,
                },
              )}
            >
              <span className="text-sm text-muted-foreground">
                {data.step!.name}
              </span>
            </div>

            <div
              className="px-2 h-full w-full "
              onClick={() => selectStepByName(data.step!.name)}
            >
              <div className="flex h-full items-center justify-between gap-4 w-full">
                <div className="flex items-center justify-center min-w-[46px] h-full">
                  <ImageWithFallback
                    width={46}
                    height={46}
                    src={stepMetadata?.logoUrl}
                    alt={stepMetadata?.displayName}
                  />
                </div>
                <div className="grow flex flex-col items-start justify-center min-w-0 w-full">
                  <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap w-full">
                    {data.step!.displayName}
                  </div>
                  <div className="text-xs text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap w-full">
                    {stepMetadata?.displayName}
                  </div>
                </div>
                <div className="w-4 flex items-center justify-center">
                  {statusInfo?.Icon &&
                    React.createElement(statusInfo.Icon, {
                      className: cn('', {
                        'text-success-300': statusInfo.variant === 'success',
                        'text-destructive-300': statusInfo.variant === 'error',
                      }),
                    })}
                  {!data.step?.valid && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleAlert className="text-warning"></CircleAlert>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Incomplete settings
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  'w-[40px] h-[70px] absolute left-[-40px] top-[0px] transition-opacity duration-300',
                  {
                    'opacity-0': !toolbarOpen,
                    'opacity-100': toolbarOpen,
                  },
                )}
              >
                <div className="flex flex-col gap-2 items-center justify-center mr-4 h-full">
                  {isTrigger && stepName && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={(e) => {
                            clickOnNewNodeButton(
                              'trigger',
                              stepName,
                              StepLocationRelativeToParent.AFTER,
                            );
                            e.stopPropagation();
                          }}
                        >
                          <Replace className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        Replace Trigger
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isAction && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={(e) => {
                              deleteStep();
                              e.stopPropagation();
                            }}
                          >
                            <Trash className="w-4 h-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">Delete step</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={(e) => {
                              duplicateStep();
                              e.stopPropagation();
                            }}
                          >
                            <CopyPlus className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          Duplicate step
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <Handle
          type="source"
          style={{ opacity: 0 }}
          position={Position.Bottom}
        />
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      </div>
    </div>
  );
});

ApStepNode.displayName = 'ApStepNode';
export { ApStepNode };
