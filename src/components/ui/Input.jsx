import React, { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    hasError = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
  },
  ref
) {
  const borderStyles = hasError
    ? 'border-red-300 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white';

  return (
    <div className="relative rounded-lg shadow-sm">
      {leftIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border py-2 text-sm transition-colors duration-150 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${borderStyles} ${
          leftIcon ? 'pl-9' : 'pl-3'
        } ${rightIcon ? 'pr-9' : 'pr-3'} ${className}`}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
});

export default Input;
