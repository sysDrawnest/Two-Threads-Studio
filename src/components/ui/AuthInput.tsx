import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        {...props}
        placeholder={label}
        className={`w-full bg-transparent border-0 border-b pb-4 pt-2 text-stone-900 placeholder:text-stone-300 focus:ring-0 focus:outline-none transition-all duration-500 font-serif text-2xl lg:text-3xl font-light
          ${error 
            ? 'border-red-300 focus:border-red-800 text-red-900' 
            : 'border-stone-300 focus:border-stone-900'
          }`}
      />
      {error && <p className="absolute -bottom-6 left-0 text-xs tracking-widest text-red-500 font-sans uppercase">{error}</p>}
    </div>
  );
};
