'use client';

import { Button } from '@/src/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface PasswordFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<'input'>, 'name' | 'id' | 'type'> {
  // Props do React Hook Form
  control: Control<TFieldValues>;
  name: TName;
  // Props específicas do componente
  label?: string;
  description?: string;
  required?: boolean;
}

export function PasswordFormField<
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
  placeholder = '••••••••',
  disabled = false,
  onChange,
  onBlur,
  ...inputProps // Todas as outras props do input HTML
}: PasswordFormFieldProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);

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
          <div className="relative">
            <Input
              {...field}
              {...inputProps}
              id={field.name}
              type={showPassword ? 'text' : 'password'}
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
