import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, rightElement, className = '', wrapperClassName = '', ...props }, ref) => {
    return (
      <div className={`relative flex items-center w-full ${wrapperClassName}`}>
        {icon && (
          <div className="absolute left-3 text-[#8b949e] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#0d1117] text-[#f0f6fc] placeholder-[#8b949e] border border-[#30363d] rounded-md px-3 py-1.5 text-sm transition-all focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] disabled:opacity-50 ${
            icon ? 'pl-9' : ''
          } ${rightElement ? 'pr-9' : ''} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2.5 text-[#8b949e] flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-[#c9d1d9]">{label}</label>}
      <textarea
        className={`w-full bg-[#0d1117] text-[#f0f6fc] placeholder-[#8b949e] border border-[#30363d] rounded-md px-3 py-2 text-sm transition-all focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
};
