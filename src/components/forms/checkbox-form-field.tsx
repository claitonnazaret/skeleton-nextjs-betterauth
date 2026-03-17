'use client';

import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/src/lib/utils';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface CheckboxOption {
  label: string;
  value: string;
  description?: string;
}

interface CheckboxFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  options?: CheckboxOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function CheckboxFormField<
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
}: CheckboxFormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className} data-invalid={fieldState.invalid}>
          {label && options && (
            <FieldLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FieldLabel>
          )}
          {description && options && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {/* Checkbox único quando options não está definido */}
          {!options ? (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id={field.name}
                name={field.name}
                checked={!!field.value}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                }}
              />
              {label && (
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-normal cursor-pointer"
                >
                  {label}
                </FieldLabel>
              )}
            </Field>
          ) : (
            /* Grupo de checkboxes quando options está definido */
            <FieldGroup
              data-slot="checkbox-group"
              className={cn(
                'flex w-full',
                orientation === 'horizontal' ? 'flex-row' : 'flex-col'
              )}
            >
              {options.map((option) => {
                const isChecked = Array.isArray(field.value)
                  ? field.value.includes(option.value)
                  : field.value === option.value;

                return (
                  <Field
                    key={option.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id={`${field.name}-${option.value}`}
                      name={field.name}
                      checked={isChecked}
                      disabled={disabled}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={(checked) => {
                        if (Array.isArray(field.value)) {
                          const updatedValue = checked
                            ? [...field.value, option.value]
                            : field.value.filter(
                                (v: string) => v !== option.value
                              );
                          field.onChange(updatedValue);
                        } else {
                          field.onChange(checked ? option.value : '');
                        }
                      }}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor={`${field.name}-${option.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  </Field>
                );
              })}
            </FieldGroup>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
