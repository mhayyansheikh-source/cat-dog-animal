"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          fontFamily: 'var(--font-body)',
        },
        success: {
          style: {
            background: 'var(--forest-green)',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: 'var(--forest-green)',
          },
        },
        error: {
          style: {
            background: '#e02424',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#e02424',
          },
        },
      }}
    />
  );
}
