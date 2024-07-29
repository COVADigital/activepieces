import { Plus, TrashIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from './button';
import { Input } from './input';
import { TextWithIcon } from './text-with-icon';

type DictionaryInputItem = {
  key: string;
  value: string;
};

type DictionaryInputProps = {
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
};

export const DictionaryInput = ({ values, onChange }: DictionaryInputProps) => {
  const [formValue, setFormValue] = useState<DictionaryInputItem[]>(
    Object.keys(values).map((key) => ({ key, value: values[key] })),
  );

  const remove = (index: number) => {
    const newValues = formValue.filter((_, i) => i !== index);
    updateValue(newValues);
  };

  const add = () => {
    updateValue([...formValue, { key: '', value: '' }]);
  };

  const onChangeValue = (
    index: number,
    value: string | undefined,
    key: string | undefined,
  ) => {
    const newValues = [...formValue];
    if (value !== undefined) {
      newValues[index].value = value;
    }
    if (key !== undefined) {
      newValues[index].key = key;
    }
    updateValue(newValues);
  };

  const updateValue = (items: DictionaryInputItem[]) => {
    setFormValue(items);
    onChange(
      items.reduce(
        (acc, current) => ({ ...acc, [current.key]: current.value }),
        {},
      ),
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {formValue.map(({ key, value }, index) => (
        <div
          key={'dictionary-input-' + index}
          className="flex items-center gap-3"
        >
          <Input
            className="h-8"
            value={key}
            onChange={(e) => onChangeValue(index, undefined, e.target.value)}
          />
          <Input
            className="h-8"
            value={value}
            onChange={(e) => onChangeValue(index, e.target.value, undefined)}
          ></Input>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => remove(index)}
          >
            <TrashIcon className="size-4 text-destructive" aria-hidden="true" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add} type="button">
        <TextWithIcon icon={<Plus size={18} />} text="Add Item" />
      </Button>
    </div>
  );
};