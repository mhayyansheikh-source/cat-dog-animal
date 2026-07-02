"use client";

import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState("unknown");

  useEffect(() => {
    // Check if navigator.connection is supported
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const updateConnectionStatus = () => {
        setConnectionType(connection.effectiveType);
        // Treat 2g and slow-2g as slow connections, or if save data is explicitly requested
        if (
          connection.effectiveType === "slow-2g" || 
          connection.effectiveType === "2g" || 
          connection.saveData === true
        ) {
          setIsSlowConnection(true);
        } else {
          setIsSlowConnection(false);
        }
      };

      // Initial check
      updateConnectionStatus();

      // Listen for changes in connection
      connection.addEventListener("change", updateConnectionStatus);
      return () => {
        connection.removeEventListener("change", updateConnectionStatus);
      };
    }
  }, []);

  return { isSlowConnection, connectionType };
}
