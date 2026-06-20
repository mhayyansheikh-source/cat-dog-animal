"use client";

import React, { useState } from "react";
import { X, User, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CustomerAuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin 
        ? { email, password } 
        : { email, password, firstName, lastName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.success) {
        onClose();
        router.push("/account");
        router.refresh();
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark z-3"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg z-3 d-flex flex-column"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom">
          <h4 className="m-0 font-heading fw-bold d-flex align-items-center gap-2">
            <User size={24} className="text-zesty-orange" />
            {isLogin ? "Sign In" : "Create Account"}
          </h4>
          <button onClick={onClose} className="btn p-1 rounded-circle">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex-grow-1 overflow-auto">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small py-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {!isLogin && (
              <div className="d-flex gap-2">
                <div>
                  <label className="form-label small fw-semibold text-muted mb-1">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-muted mb-1">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="form-label small fw-semibold text-muted mb-1 d-flex align-items-center gap-1">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="form-label small fw-semibold text-muted mb-1 d-flex align-items-center gap-1">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={5}
              />
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn btn-zesty-primary w-100 mt-2 py-2 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={20} className="spin" style={{ animation: "spin 1s linear infinite" }} /> : (isLogin ? "Sign In" : "Register")}
            </motion.button>
          </form>

          <div className="text-center mt-4 pt-3 border-top">
            <span className="text-muted small">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }} 
              className="btn btn-link text-decoration-none fw-bold text-zesty-orange p-0 ms-2 align-baseline"
            >
              {isLogin ? "Create one" : "Sign in here"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
