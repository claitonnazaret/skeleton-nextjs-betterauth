'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  // Props do React Hook Form
  control: Control<TFieldValues>;
  name: TName;
  // Props específicas do componente
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  // Props adicionais do Select
  onValueChange?: (value: string) => void;
}

export function SelectFormField<
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
  disabled = false,
  required = false,
  className,
  // Props adicionais
  onValueChange,
}: SelectFormFieldProps<TFieldValues, TName>) {
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

          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value); // Handler do React Hook Form (obrigatório)
              onValueChange?.(value); // Handler customizado (opcional)
            }}
            disabled={disabled}
            name={field.name}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
