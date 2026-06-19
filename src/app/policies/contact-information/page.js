"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";

export default function ContactInformationPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <article className="font-body">
      <header className="mb-4">
        <h2 className="font-heading display-6 mb-2">Contact Information</h2>
        <p className="text-muted small">Reach out to us directly. We reply within 24 hours.</p>
      </header>

      <hr className="my-4" />

      <div className="row g-4">
        {/* Contact Details List */}
        <div className="col-12 col-md-5">
          <div className="bg-light p-4 rounded shadow-sm border h-100">
            <h4 className="font-heading fs-5 mb-4 text-charcoal-dark d-flex align-items-center gap-2">
              <MessageSquare size={20} className="text-zesty-orange" />
              Direct Contacts
            </h4>
            
            <div className="d-flex align-items-start gap-3 mb-3">
              <Mail className="text-forest-green flex-shrink-0 mt-1" size={20} />
              <div>
                <strong className="d-block small text-muted text-uppercase">Customer Support</strong>
                <a href="mailto:shoppingmaniaglobalstore@gmail.com" className="text-zesty-orange small text-decoration-none">
                  shoppingmaniaglobalstore@gmail.com
                </a>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3">
              <Phone className="text-forest-green flex-shrink-0 mt-1" size={20} />
              <div>
                <strong className="d-block small text-muted text-uppercase">Toll-Free Phone</strong>
                <a href="tel:+15715166562" className="text-zesty-orange small text-decoration-none">
                  +1 (571) 516-6562
                </a>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3">
              <MapPin className="text-forest-green flex-shrink-0 mt-1" size={20} />
              <div>
                <strong className="d-block small text-muted text-uppercase">Registered Office</strong>
                <span className="small text-muted d-block">
                  Shopping Mania Global Store (Single member LLC)<br />
                  8401 Mayland Dr #6445<br />
                  Richmond, VA 23294<br />
                  United States
                </span>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3">
              <Clock className="text-forest-green flex-shrink-0 mt-1" size={20} />
              <div>
                <strong className="d-block small text-muted text-uppercase">Support Hours</strong>
                <span className="small text-muted d-block">
                  Monday - Friday<br />
                  9:00 AM - 5:00 PM EST
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Inquiry */}
        <div className="col-12 col-md-7">
          <div className="border p-4 rounded shadow-sm">
            <h4 className="font-heading fs-5 mb-4 text-charcoal-dark">
              Send an Inquiry
            </h4>
            
            {submitted ? (
              <div className="alert alert-success py-3 text-center" role="alert">
                <h5 className="alert-heading fw-bold mb-1">✓ Message Sent Successfully!</h5>
                <p className="small mb-0 text-muted">
                  Thank you for contacting us. A support representative will review your message and get back to you at the email address provided within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="small">
                <div className="mb-3">
                  <label htmlFor="contact-name" className="form-label fw-semibold">Your Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact-email" className="form-label fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="form-control"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact-subject" className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    className="form-control"
                    placeholder="e.g. Order Delivery Status"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact-message" className="form-label fw-semibold">Message *</label>
                  <textarea
                    id="contact-message"
                    rows="4"
                    className="form-control"
                    placeholder="Type details about your inquiry here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-zesty-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-bold uppercase">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
