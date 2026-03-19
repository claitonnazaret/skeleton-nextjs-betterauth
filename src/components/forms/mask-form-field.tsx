'use client';

import { InputMasked } from '@/src/components/forms/input-mask';
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

interface MaskFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<'input'>, 'name' | 'id'> {
  // Props do React Hook Form
  control: Control<TFieldValues>;
  name: TName;
  // Props específicas do componente
  label?: string;
  description?: string;
  mask: string;
  maskPlaceholder?: string;
  required?: boolean;
}

export function MaskFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  // Props do React Hook Form
  control,
  name,
  // Props específicas do componente
  label,
  description,
  mask,
  maskPlaceholder = '_',
  required = false,
  // Props do input nativo
  className,
  placeholder,
  disabled = false,
  onChange,
  onBlur,
  ...inputProps // Todas as outras props do input HTML
}: MaskFormFieldProps<TFieldValues, TName>) {
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
          <InputMasked
            {...field}
            {...inputProps}
            id={field.name}
            mask={mask}
            maskPlaceholder={maskPlaceholder}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
            onBlur={(e) => {
              field.onBlur();
              onBlur?.(e);
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
