"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Boundary caught a critical error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
          <AlertTriangle size={80} color="#e02424" style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            Critical System Error
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2.5rem', maxWidth: '600px' }}>
            We've encountered a critical error while trying to load the application. Our engineers have been notified.
          </p>
          <button 
            onClick={() => reset()}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#F5761A', color: 'white', border: 'none', borderRadius: '9999px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCcw size={18} />
            Attempt Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
