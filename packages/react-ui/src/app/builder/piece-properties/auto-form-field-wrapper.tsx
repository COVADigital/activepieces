import { t } from 'i18next';
import { SquareFunction } from 'lucide-react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { FormItem, FormLabel } from '@/components/ui/form';
import { ReadMoreDescription } from '@/components/ui/read-more-description';
import { Toggle } from '@/components/ui/toggle';
import { PieceProperty } from '@activepieces/pieces-framework';
import { Action, Trigger } from '@activepieces/shared';

import { TextInputWithMentions } from './text-input-with-mentions';

type AutoFormFieldWrapperProps = {
  children: React.ReactNode;
  allowDynamicValues: boolean;
  propertyName: string;
  property: PieceProperty;
  hideDescription?: boolean;
  placeBeforeLabelText?: boolean;
  disabled: boolean;
  field: ControllerRenderProps<Record<string, any>, string>;
};

const AutoFormFieldWrapper = ({
  placeBeforeLabelText = false,
  children,
  hideDescription,
  allowDynamicValues,
  propertyName,
  property,
  disabled,
  field,
}: AutoFormFieldWrapperProps) => {
  const form = useFormContext<Action | Trigger>();
  const toggled =
    form.getValues().settings?.inputUiInfo?.customizedInputs?.[propertyName];

  function handleChange(pressed: boolean) {
    form.setValue(
      `settings.inputUiInfo.customizedInputs.${propertyName}` as const,
      pressed,
      {
        shouldValidate: true,
      },
    );
    form.setValue(
      `settings.input.${propertyName}` as const,
      property.defaultValue,
      {
        shouldValidate: true,
      },
    );
  }

  return (
    <FormItem className="flex flex-col gap-1">
      <FormLabel className="flex items-center gap-1">
        {placeBeforeLabelText && !toggled && children}
        <span>{t(property.displayName)}</span>
        {property.required && <span className="text-destructive">*</span>}
        <span className="grow"></span>
        {allowDynamicValues && (
          <Toggle
            pressed={toggled}
            onPressedChange={(e) => handleChange(e)}
            disabled={disabled}
          >
            <SquareFunction className="stroke-foreground" />
          </Toggle>
        )}
      </FormLabel>

      {allowDynamicValues && toggled && (
        <TextInputWithMentions
          disabled={disabled}
          onChange={field.onChange}
          initialValue={property.defaultValue}
        ></TextInputWithMentions>
      )}
      {!placeBeforeLabelText && !toggled && <div>{children}</div>}
      {property.description && !hideDescription && (
        <ReadMoreDescription text={t(property.description)} />
      )}
    </FormItem>
  );
};

AutoFormFieldWrapper.displayName = 'AutoFormFieldWrapper';

export { AutoFormFieldWrapper };
