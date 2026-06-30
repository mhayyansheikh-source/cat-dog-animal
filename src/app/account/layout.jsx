'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar: Explore Menu */}
        <div className="col-md-3 mb-4 mb-md-0">
          <div className="sticky-top" style={{ top: '100px' }}>
            <h2 className="h4 fw-bold mb-4 font-heading text-uppercase" style={{ letterSpacing: '0.05em' }}>Explore</h2>
            <nav className="nav flex-column gap-3">
              <Link 
                href="/account/orders" 
                className={`nav-link px-0 fs-5 ${pathname.includes('/orders') ? 'text-dark fw-bold' : 'text-muted'}`}
              >
                Orders
              </Link>
              <Link 
                href="/account/profile" 
                className={`nav-link px-0 fs-5 ${pathname.includes('/profile') ? 'text-dark fw-bold' : 'text-muted'}`}
              >
                Profile
              </Link>
              <hr className="my-2" />
              <button 
                onClick={async () => {
                  const { logoutAction } = await import('@/app/actions/account');
                  await logoutAction();
                  window.location.href = '/account/login';
                }}
                className="nav-link px-0 text-danger text-start border-0 bg-transparent fs-5"
              >
                Log out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9">
          {children}
        </div>
      </div>
    </div>
  );
}
