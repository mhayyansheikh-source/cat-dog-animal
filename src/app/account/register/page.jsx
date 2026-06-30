'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerAction } from '@/app/actions/account';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push('/account/orders');
      router.refresh();
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <div className="text-center mb-4">
        <h1 className="h3">Create an Account</h1>
        <p className="text-muted">Join us today to manage your orders.</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input 
              type="text" 
              className="form-control form-control-lg" 
              id="firstName" 
              name="firstName" 
              required 
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input 
              type="text" 
              className="form-control form-control-lg" 
              id="lastName" 
              name="lastName" 
              required 
            />
          </div>
        </div>
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
            minLength="5"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-dark w-100 btn-lg rounded-pill-cta" 
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-muted">
          Already have an account? <Link href="/account/login" className="text-dark fw-bold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
