import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-xs font-medium tracking-wider uppercase text-stone-500 mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 bg-stone-50 border transition-all duration-200 text-stone-800 rounded-none focus:outline-none text-sm
          ${error 
            ? 'border-red-400 focus:border-red-500 bg-red-50/10' 
            : 'border-stone-200 focus:border-stone-800 focus:bg-white'
          }`}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-light">{error}</p>}
    </div>
  );
};
