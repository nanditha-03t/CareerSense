import React from 'react';

export default function FormField({
  id,
  label,
  required = false,
  optional = false,
  error,
  hint,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700">
          <label htmlFor={id} className="inline-flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-red-500 font-semibold" aria-hidden="true">*</span>}
          </label>
          {optional && (
            <span className="text-xs text-slate-400 font-normal">Optional</span>
          )}
        </div>
      )}
      {children}
      {error && (
        <p id={id ? `${id}-error` : undefined} className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
