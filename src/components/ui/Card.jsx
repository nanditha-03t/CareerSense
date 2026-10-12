import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, children, className = '' }) {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 pb-6 pt-2 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 bg-slate-50/60 border-t border-slate-100 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
}
