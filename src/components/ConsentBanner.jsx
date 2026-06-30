'use client';

import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Check if user has already set their consent preference
    const consentStatus = localStorage.getItem('us_consent_status');
    if (!consentStatus) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('us_consent_status', 'accepted');
    setIsVisible(false);
  };

  const handleOptOut = () => {
    localStorage.setItem('us_consent_status', 'opted_out');
    // In a real app, you would also trigger GTM or analytics blocking here
    window.dispatchEvent(new Event('privacy_opt_out'));
    
    setIsVisible(false);
    setToastMessage('Your privacy preferences have been saved. Tracking disabled.');
    
    // Hide toast after 4 seconds
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  return (
    <>
      {/* The Consent Banner */}
      {isVisible && (
        <div 
          className="fixed-bottom bg-dark text-white p-3 shadow-lg" 
          style={{ zIndex: 1050, borderTop: '1px solid #333' }}
        >
          <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="small mb-0 text-center text-md-start">
              We use cookies to improve your experience and personalize marketing. By using our site, you agree to our Privacy Policy.
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button 
                onClick={handleOptOut} 
                className="btn btn-outline-light btn-sm rounded-pill"
              >
                Do Not Sell My Info
              </button>
              <button 
                onClick={handleAccept} 
                className="btn btn-light btn-sm rounded-pill px-4 fw-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The Toast Notification */}
      {toastMessage && (
        <div 
          className="position-fixed bottom-0 end-0 p-3" 
          style={{ zIndex: 1100 }}
        >
          <div className="toast show align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                {toastMessage}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage('')} aria-label="Close"></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
