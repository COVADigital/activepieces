import { DropdownState } from '@activepieces/pieces-framework';
import { Action, Trigger } from '@activepieces/shared';
import { useMutation } from '@tanstack/react-query';
import deepEqual from 'deep-equal';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { MultiSelectPieceProperty } from './multi-select-piece-property';

import { useBuilderStateContext } from '@/app/builder/builder-hooks';
import { SearchableSelect } from '@/components/custom/searchable-select';
import { piecesApi } from '@/features/pieces/lib/pieces-api';

type SelectPiecePropertyProps = {
  refreshers: string[];
  propertyName: string;
  initialValue?: unknown;
  multiple?: boolean;
  disabled: boolean;
  enableSelectOrClear?: boolean;
  onChange: (value: unknown | undefined) => void;
};
const DynamicDropdownPieceProperty = React.memo(
  (props: SelectPiecePropertyProps) => {
    const [flowVersion] = useBuilderStateContext((state) => [
      state.flowVersion,
    ]);
    const form = useFormContext<Action | Trigger>();
    const isFirstRender = useRef(true);
    const previousValues = useRef<undefined | unknown[]>(undefined);

    const newRefreshers = [...props.refreshers, 'auth'];
    const [dropdownState, setDropdownState] = useState<DropdownState<unknown>>({
      disabled: false,
      placeholder: t('Select an option'),
      options: [],
    });
    const { mutate, isPending } = useMutation<
      DropdownState<unknown>,
      Error,
      { input: Record<string, unknown> }
    >({
      mutationFn: async ({ input }) => {
        const { settings } = form.getValues();
        const actionOrTriggerName = settings.actionName ?? settings.triggerName;
        const { pieceName, pieceVersion, pieceType, packageType } = settings;
        const response = piecesApi.options<DropdownState<unknown>>({
          pieceName,
          pieceVersion,
          pieceType,
          packageType,
          propertyName: props.propertyName,
          actionOrTriggerName: actionOrTriggerName,
          input: input,
          flowVersionId: flowVersion.id,
          flowId: flowVersion.flowId,
        });
        return response;
      },
      onError: (error) => {
        console.error(error);
      },
    });

    /* eslint-disable react-hooks/rules-of-hooks */
    const refresherValues = newRefreshers.map((refresher) =>
      useWatch({
        name: `settings.input.${refresher}` as const,
        control: form.control,
      }),
    );
    /* eslint-enable react-hooks/rules-of-hooks */

    useEffect(() => {
      const input: Record<string, unknown> = {};
      newRefreshers.forEach((refresher, index) => {
        input[refresher] = refresherValues[index];
      });

      if (
        !isFirstRender.current &&
        !deepEqual(previousValues.current, refresherValues)
      ) {
        props.onChange(undefined);
      }

      previousValues.current = refresherValues;
      isFirstRender.current = false;

      mutate(
        { input },
        {
          onSuccess: (response) => {
            setDropdownState(response);
          },
        },
      );
    }, refresherValues);

    const selectOptions = dropdownState.options.map((option) => ({
      label: option.label,
      value: option.value as React.Key,
    }));
    return props.multiple ? (
      <MultiSelectPieceProperty
        placeholder={dropdownState.placeholder ?? t('Select an option')}
        options={selectOptions}
        onChange={(value) => props.onChange(value)}
        disabled={dropdownState.disabled || props.disabled}
        initialValues={props.initialValue as unknown[]}
        enableSelectOrClear={false}
      />
    ) : (
      <SearchableSelect
        options={selectOptions}
        disabled={dropdownState.disabled || props.disabled}
        loading={isPending}
        placeholder={dropdownState.placeholder ?? t('Select an option')}
        value={props.initialValue as React.Key}
        onChange={(value) => props.onChange(value)}
      />
    );
  },
);

DynamicDropdownPieceProperty.displayName = 'DynamicDropdownPieceProperty';
export { DynamicDropdownPieceProperty };
