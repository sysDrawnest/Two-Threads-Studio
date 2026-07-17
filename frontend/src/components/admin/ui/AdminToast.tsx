import React from 'react';
import { Toaster } from 'react-hot-toast';

export const AdminToast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'border border-outline-variant bg-surface-container text-primary-container shadow-sm font-sans text-sm rounded-md',
        duration: 4000,
        style: {
          background: '#f2ede8',
          color: '#2d2520',
          border: '1px solid #d1c4bd',
        },
        success: {
          iconTheme: {
            primary: '#137333',
            secondary: '#e6f4ea',
          },
        },
        error: {
          iconTheme: {
            primary: '#c5221f',
            secondary: '#fce8e6',
          },
        },
      }}
    />
  );
};
