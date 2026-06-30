'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/app/actions/account';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push('/account/orders');
      router.refresh(); // Refresh to update layout state
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <div className="text-center mb-4">
        <h1 className="h3">Login</h1>
        <p className="text-muted">Welcome back! Please enter your details.</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control form-control-lg" 
            id="email" 
            name="email" 
            required 
            placeholder="you@example.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control form-control-lg" 
            id="password" 
            name="password" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-dark w-100 btn-lg rounded-pill-cta" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-muted">
          Don't have an account? <Link href="/account/register" className="text-dark fw-bold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
