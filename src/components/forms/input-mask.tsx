'use client';

import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';
import type React from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

export interface InputMaskedProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> {
  mask: string;
  maskPlaceholder?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputMasked = forwardRef<HTMLInputElement, InputMaskedProps>(
  (
    {
      mask,
      maskPlaceholder = '_',
      placeholder,
      value = '',
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(
      formatWithMask(value || '', mask)
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const [selection, setSelection] = useState<{
      start: number | null;
      end: number | null;
    }>({
      start: null,
      end: null,
    });

    const handleRef = (instance: HTMLInputElement | null) => {
      inputRef.current = instance;
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    };

    useEffect(() => {
      const formattedValue = formatWithMask(value || '', mask);
      if (formattedValue !== inputValue) {
        setInputValue(formattedValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, mask]);

    useEffect(() => {
      if (
        inputRef.current &&
        selection.start !== null &&
        selection.end !== null
      ) {
        inputRef.current.setSelectionRange(selection.start, selection.end);
      }
    }, [selection]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const inputElement = e.target;
      const cursorStart = inputElement.selectionStart || 0;
      const previousValue = inputValue;
      const typedValue = inputElement.value;

      const rawValue = unmaskValue(typedValue, mask);
      const newValue = formatWithMask(rawValue, mask);
      const newCursorPosition = calculateCursorPosition(
        previousValue,
        newValue,
        cursorStart,
        mask
      );

      setInputValue(newValue);
      setSelection({ start: newCursorPosition, end: newCursorPosition });

      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: newValue },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <Input
        ref={handleRef}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || getMaskPlaceholder(mask, maskPlaceholder)}
        className={cn(className)}
        {...props}
      />
    );
  }
);

InputMasked.displayName = 'InputMasked';

function formatWithMask(value: string, mask: string): string {
  let result = '';
  let valueIndex = 0;

  for (const maskChar of mask) {
    if (valueIndex >= value.length) break;

    const char = value[valueIndex];
    if (maskChar === '9' && /[0-9]/.test(char)) {
      result += char;
      valueIndex++;
    } else if (maskChar === 'a' && /[a-zA-Z]/.test(char)) {
      result += char;
      valueIndex++;
    } else if (maskChar === '*' && /[a-zA-Z0-9]/.test(char)) {
      result += char;
      valueIndex++;
    } else {
      result += maskChar;
      if (char === maskChar) valueIndex++;
    }
  }

  return result;
}

function unmaskValue(value: string, mask: string): string {
  let result = '';
  let maskIndex = 0;

  for (const valueChar of value) {
    let maskChar: string | null = null;
    while (maskIndex < mask.length) {
      maskChar = mask[maskIndex++];
      if (maskChar === '9' || maskChar === 'a' || maskChar === '*') break;
      if (maskChar === valueChar) {
        maskChar = null;
        break;
      }
    }

    if (maskChar === '9' && /[0-9]/.test(valueChar)) {
      result += valueChar;
    } else if (maskChar === 'a' && /[a-zA-Z]/.test(valueChar)) {
      result += valueChar;
    } else if (maskChar === '*' && /[a-zA-Z0-9]/.test(valueChar)) {
      result += valueChar;
    }
  }

  return result;
}

function getMaskPlaceholder(mask: string, placeholder: string): string {
  return mask.replace(/[9a*]/g, placeholder);
}

function calculateCursorPosition(
  previousValue: string,
  newValue: string,
  cursorPosition: number,
  mask: string
): number {
  if (newValue.length > previousValue.length) {
    for (let i = cursorPosition; i < mask.length; i++) {
      if (mask[i] === '9' || mask[i] === 'a' || mask[i] === '*') {
        return i + 1;
      }
    }
    return newValue.length;
  }

  return cursorPosition;
}

export { InputMasked };
