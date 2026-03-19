'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';
import { Label } from '@/src/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import * as React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface RadioOption {
  label: string | React.ReactNode;
  value: string;
  description?: string;
}

interface RadioGroupFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  options: RadioOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  // Eventos customizados
  onValueChange?: (value: string) => void;
}

export function RadioGroupFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  disabled = false,
  required = false,
  className,
  orientation = 'vertical',
  onValueChange, // Evento customizado
}: RadioGroupFormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            disabled={disabled}
            className={
              orientation === 'horizontal'
                ? 'flex flex-wrap gap-4'
                : 'space-y-3'
            }
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.name}-${option.value}`}
                  aria-invalid={fieldState.invalid}
                />
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className="cursor-pointer font-normal"
                >
                  {option.label}
                  {option.description && (
                    <span className="block text-sm text-muted-foreground mt-1">
                      {option.description}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
