import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = forwardRef(function PasswordInput(
  {
    id,
    value,
    onChange,
    placeholder = '••••••••',
    disabled = false,
    hasError = false,
    showLockIcon = true,
    className = '',
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    if (!disabled) {
      setShowPassword((prev) => !prev);
    }
  };

  const borderStyles = hasError
    ? 'border-red-300 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white';

  return (
    <div className="relative rounded-lg shadow-sm">
      {showLockIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Lock className="w-4 h-4" />
        </div>
      )}
      <input
        ref={ref}
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border py-2 text-sm transition-colors duration-150 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${borderStyles} ${
          showLockIcon ? 'pl-9' : 'pl-3'
        } pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={toggleVisibility}
        disabled={disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
