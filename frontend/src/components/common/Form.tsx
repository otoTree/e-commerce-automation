import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

// 表单字段类型定义
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'switch';
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  rows?: number; // for textarea
  defaultValue?: unknown;
}

// 通用表单组件属性
interface FormProps {
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  submitText?: string;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function FormBuilder({
  fields,
  onSubmit,
  submitText = '提交',
  loading = false,
  className = '',
  children,
}: FormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label}是必填项`;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };
  
  const handleFieldChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const { name, label, type, placeholder, description, required, options, disabled, rows } = field;
    const value = formData[name];
    const error = errors[name];

    return (
      <div key={name} className="space-y-2">
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {type === 'text' || type === 'email' || type === 'password' || type === 'number' ? (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled || loading}
            value={value as string || ''}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        ) : type === 'textarea' ? (
          <Textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled || loading}
            rows={rows || 3}
            value={value as string || ''}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        ) : type === 'select' ? (
          <Select
            onValueChange={(val) => handleFieldChange(name, val)}
            value={value as string || ''}
            disabled={disabled || loading}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={placeholder || '请选择'} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === 'checkbox' ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={value as boolean || false}
              onCheckedChange={(checked) => handleFieldChange(name, checked)}
              disabled={disabled || loading}
            />
            <Label htmlFor={name} className="text-sm font-normal">
              {placeholder || label}
            </Label>
          </div>
        ) : type === 'switch' ? (
          <div className="flex items-center space-x-2">
            <Switch
              id={name}
              checked={value as boolean || false}
              onCheckedChange={(checked) => handleFieldChange(name, checked)}
              disabled={disabled || loading}
            />
            <Label htmlFor={name} className="text-sm font-normal">
              {placeholder || label}
            </Label>
          </div>
        ) : null}
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {fields.map(renderField)}
      
      {children}
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? '提交中...' : submitText}
        </Button>
      </div>
    </form>
  );
}