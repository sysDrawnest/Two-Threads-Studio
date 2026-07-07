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
        className={`peer w-full bg-transparent border-0 border-b-[0.5px] py-3 px-0 text-stone-800 placeholder-transparent focus:ring-0 focus:outline-none transition-all duration-300 font-sans text-sm
          ${error 
            ? 'border-red-400 focus:border-red-600' 
            : 'border-stone-300 focus:border-stone-800'
          }`}
        placeholder={label} // Required for peer-placeholder-shown to work
      />
      <label className={`absolute left-0 top-3 -translate-y-6 scale-[0.85] transform text-stone-600 transition-all duration-300 origin-[0]
        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:font-sans peer-placeholder-shown:text-stone-400 peer-placeholder-shown:uppercase peer-placeholder-shown:tracking-wider peer-placeholder-shown:text-xs
        peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-focus:font-serif peer-focus:text-stone-600 peer-focus:tracking-normal peer-focus:text-base peer-focus:capitalize
        ${error ? 'text-red-500 peer-focus:text-red-600' : ''}`}>
        {label}
      </label>
      {error && <p className="absolute -bottom-5 left-0 text-[10px] tracking-wide text-red-500 font-light">{error}</p>}
    </div>
  );
};
