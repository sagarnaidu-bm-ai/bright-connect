import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
