'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxValue,
} from '@/src/components/ui/combobox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboBoxFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  options: ComboboxOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function ComboBoxFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = 'Selecione uma opção',
  description,
  options,
  disabled = false,
  required = false,
  className,
  emptyMessage = 'Nenhuma opção encontrada',
}: ComboBoxFormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel htmlFor={field.name}>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
          )}
          <Combobox
            value={field.value || undefined}
            onValueChange={(value) => field.onChange(value || '')}
            disabled={disabled}
          >
            <ComboboxInput
              id={field.name}
              placeholder={placeholder}
              showTrigger
              showClear={!!field.value}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
            <ComboboxContent>
              <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
              {options.map((option) => (
                <ComboboxItem key={option.value} value={option.value}>
                  <ComboboxValue>{option.label}</ComboboxValue>
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
