'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account/orders');
  }, [router]);

  return <div className="text-center p-5"><div className="spinner-border text-dark" role="status"></div></div>;
}
