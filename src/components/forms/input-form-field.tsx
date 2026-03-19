'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import type React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface InputFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<'input'>, 'name' | 'id'> {
  // Props do React Hook Form
  control: Control<TFieldValues>;
  name: TName;
  // Props específicas do componente
  label?: string;
  description?: string;
  required?: boolean;
}

export function InputFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  // Props do React Hook Form
  control,
  name,
  // Props específicas do componente
  label,
  description,
  required = false,
  // Props do input nativo
  className,
  type = 'text',
  disabled = false,
  placeholder,
  onChange,
  onBlur,
  ...inputProps // Todas as outras props do input HTML (onFocus, onKeyDown, onClick, etc)
}: InputFormFieldProps<TFieldValues, TName>) {
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
          <Input
            {...field}
            {...inputProps} // Spread de todas as props herdadas do input
            id={field.name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            // Combinar handlers do React Hook Form com handlers customizados
            onChange={(e) => {
              field.onChange(e); // Handler do React Hook Form (obrigatório)
              onChange?.(e); // Handler customizado (opcional)
            }}
            onBlur={(e) => {
              field.onBlur(); // Handler do React Hook Form (obrigatório)
              onBlur?.(e); // Handler customizado (opcional)
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
