import { useDraggable } from '@dnd-kit/core';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Handle, Position } from '@xyflow/react';
import { t } from 'i18next';
import { ArrowRightLeft, CopyPlus, Trash } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import {
  StepPathWithName,
  builderSelectors,
  useBuilderStateContext,
} from '@/app/builder/builder-hooks';
import ImageWithFallback from '@/app/components/image-with-fallback';
import { InvalidStepIcon } from '@/components/custom/alert-icon';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { UNSAVED_CHANGES_TOAST, useToast } from '@/components/ui/use-toast';
import { flowRunUtils } from '@/features/flow-runs/lib/flow-run-utils';
import { piecesHooks } from '@/features/pieces/lib/pieces-hook';
import { cn } from '@/lib/utils';
import {
  FlowOperationType,
  FlowRun,
  FlowRunStatus,
  StepLocationRelativeToParent,
  TriggerType,
  flowHelper,
  isNil,
} from '@activepieces/shared';

import { AP_NODE_SIZE, ApNode, DRAGGED_STEP_TAG } from '../flow-canvas-utils';

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
    readonly,
  ] = useBuilderStateContext((state) => [
    state.selectStepByName,
    state.setAllowCanvasPanning,
    state.selectedStep?.stepName === data.step?.name,
    state.activeDraggingStep === data.step?.name,
    state.clickOnNewNodeButton,
    state.selectedStep,
    state.run,
    state.readonly,
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

  const [showStepActionsList, setToolbarOpen] = useState(false);

  const isTrigger = flowHelper.isTrigger(data.step!.type);
  const isAction = flowHelper.isAction(data.step!.type);

  const stepName = data?.step?.name;

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: data.step!.name,
    disabled: isTrigger || readonly,
    data: {
      type: DRAGGED_STEP_TAG,
    },
  });

  const stepOutputStatus = useMemo(
    () => getStepStatus(stepName, selectedStep, run),
    [stepName, selectedStep, run],
  );

  const showRunningIcon =
    isNil(stepOutputStatus) && run?.status === FlowRunStatus.RUNNING;
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
      id={data.step!.name}
      style={{
        height: `${AP_NODE_SIZE.stepNode.height}px`,
        width: `${AP_NODE_SIZE.stepNode.width}px`,
      }}
      className={cn(
        'transition-all border-box border rounded-sm border border-solid  border-border-300 relative',
        {
          'shadow-step-container': !isDragging,
          'border-primary': showStepActionsList || isSelected,
          'bg-background': !isDragging,
          'border-none': isDragging,
          'shadow-none': isDragging,
        },
      )}
      onClick={(e) => handleStepClick(e)}
      onMouseEnter={() => {
        setToolbarOpen(true && !readonly);
        setAllowCanvasPanning(false);
      }}
      onMouseLeave={() => {
        setToolbarOpen(false);
        setAllowCanvasPanning(true);
      }}
      key={data.step?.name}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          'absolute left-0 top-0 pointer-events-none  rounded-sm w-full h-full',
          {
            'border-t-[3px] border-primary border-solid':
              (isSelected || showStepActionsList) && !isDragging,
          },
        )}
      ></div>
      <div className="px-3 h-full w-full  overflow-hidden">
        {!isDragging && (
          <>
            <div
              className={cn(
                'w-[40px] h-[70px] absolute right-[-50px] top-[20px] transition-opacity duration-300',
                {
                  'opacity-0': !showStepActionsList,
                  'opacity-100': showStepActionsList,
                },
              )}
            >
              <span className="text-sm text-muted-foreground">
                {data.step?.name}
              </span>
            </div>

            <div
              className=" h-full w-full "
              onClick={() => selectStepByName(data.step!.name)}
            >
              <div className="flex h-full items-center justify-between gap-3 w-full">
                <div className="flex items-center justify-center min-w-[46px] h-full">
                  <ImageWithFallback
                    width={40}
                    height={40}
                    src={stepMetadata?.logoUrl}
                    alt={stepMetadata?.displayName}
                  />
                </div>
                <div className="grow flex flex-col items-start justify-center min-w-0 w-full">
                  <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap w-full">
                    {data.step?.displayName}
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="text-xs truncate text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap w-full">
                      {stepMetadata?.displayName}
                    </div>
                    <div className="w-4 flex items-center justify-center">
                      {statusInfo &&
                        React.createElement(statusInfo.Icon, {
                          className: cn('', {
                            'text-success-300':
                              statusInfo.variant === 'success',
                            'text-destructive-300':
                              statusInfo.variant === 'error',
                          }),
                        })}
                      {showRunningIcon && (
                        <LoadingSpinner className="w-4 h-4 text-primary"></LoadingSpinner>
                      )}
                      {!data.step?.valid && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InvalidStepIcon
                              size={16}
                              viewBox="0 0 16 16"
                              className="stroke-0 animate-fade"
                            ></InvalidStepIcon>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            {t('Incomplete settings')}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'w-[40px] h-[70px] absolute left-[-40px] top-[0px] transition-opacity duration-300',
                  {
                    'opacity-0 pointer-events-none': !showStepActionsList,
                    'opacity-100': showStepActionsList,
                  },
                )}
              >
                {!readonly && (
                  <div className="flex flex-col gap-2 items-center justify-center mr-4 h-full">
                    {isTrigger && stepName && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={(e) => {
                              if (!showStepActionsList) {
                                return;
                              }
                              clickOnNewNodeButton(
                                t('trigger'),
                                stepName,
                                StepLocationRelativeToParent.AFTER,
                              );
                              e.stopPropagation();
                            }}
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          {t('Replace Trigger')}
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
                              className="rounded-full min-w-9 min-h-9 max-w-9 max-h-9 p-1"
                              onClick={(e) => {
                                if (!showStepActionsList) {
                                  return;
                                }
                                deleteStep();
                                e.stopPropagation();
                              }}
                            >
                              <Trash className="w-4 h-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {t('Delete step')}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-full min-w-9 min-h-9 max-w-9 max-h-9 p-1"
                              onClick={(e) => {
                                if (!showStepActionsList) {
                                  return;
                                }
                                duplicateStep();
                                e.stopPropagation();
                              }}
                            >
                              <CopyPlus className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {t('Duplicate step')}
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                )}
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
