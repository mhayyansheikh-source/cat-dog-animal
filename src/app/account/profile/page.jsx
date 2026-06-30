'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfileAction } from '@/app/actions/account';

export default function ProfilePage() {
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const res = await getProfileAction();
      if (res.error) {
        router.push('/account/login');
      } else {
        setCustomer(res.customer);
      }
    }
    loadProfile();
  }, [router]);

  if (!customer) {
    return <div className="text-center p-5"><div className="spinner-border text-dark" role="status"></div></div>;
  }

  return (
    <div>
      <h1 className="h3 mb-4">Profile Details</h1>
      
      <div className="card border p-4 rounded-card shadow-sm mb-4">
        <h2 className="h5 mb-4 border-bottom pb-2">Account Info</h2>
        <div className="row g-3">
          <div className="col-sm-6">
            <label className="text-muted small text-uppercase fw-bold">First Name</label>
            <div className="fs-5">{customer.firstName || '-'}</div>
          </div>
          <div className="col-sm-6">
            <label className="text-muted small text-uppercase fw-bold">Last Name</label>
            <div className="fs-5">{customer.lastName || '-'}</div>
          </div>
          <div className="col-sm-6">
            <label className="text-muted small text-uppercase fw-bold">Email</label>
            <div className="fs-5">{customer.email}</div>
          </div>
          <div className="col-sm-6">
            <label className="text-muted small text-uppercase fw-bold">Phone</label>
            <div className="fs-5">{customer.phone || '-'}</div>
          </div>
        </div>
      </div>

      <div className="card border p-4 rounded-card shadow-sm">
        <h2 className="h5 mb-4 border-bottom pb-2">Default Address</h2>
        {customer.defaultAddress ? (
          <div>
            <div>{customer.defaultAddress.address1}</div>
            {customer.defaultAddress.address2 && <div>{customer.defaultAddress.address2}</div>}
            <div>{customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}</div>
            <div>{customer.defaultAddress.country}</div>
          </div>
        ) : (
          <p className="text-muted mb-0">No default address saved.</p>
        )}
      </div>
    </div>
  );
}
