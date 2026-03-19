'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/src/components/ui/combobox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';
import type React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface ComboboxOption {
  label: string;
  value: string;
  description?: string;
}

interface ComboboxFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
  React.ComponentProps<typeof Combobox>,
  'name' | 'value' | 'onValueChange' | 'items' | 'itemToStringValue'
> {
  // Props do React Hook Form
  control: Control<TFieldValues>;
  name: TName;
  // Props específicas do componente
  label?: string;
  placeholder?: string;
  description?: string;
  options: ComboboxOption[];
  required?: boolean;
  // Props do Field
  className?: string;
  // Props do ComboboxEmpty
  emptyMessage?: string;
  showEmpty?: boolean;
}

export function ComboboxFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  // Props do React Hook Form
  control,
  name,
  // Props específicas do componente
  label,
  placeholder = 'Selecione uma opção',
  description,
  options,
  required = false,
  className,
  emptyMessage = 'Nenhuma opção encontrada',
  // Props herdadas do Combobox
  disabled = false,
  ...comboboxProps
}: ComboboxFormFieldProps<TFieldValues, TName>) {
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
            {...comboboxProps}
            name={field.name}
            onValueChange={field.onChange}
            items={options}
            itemToStringValue={(option) => (option as ComboboxOption).label}
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
              <ComboboxList>
                {(option: ComboboxOption) => (
                  <ComboboxItem key={option.value} value={option}>
                    <div className="flex flex-col gap-2">
                      <span>{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
