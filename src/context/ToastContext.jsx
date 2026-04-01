import { createContext, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {

  const showSuccessToast = (message) => toast.success(message);
  const showErrorToast = (message) => toast.error(message);

  const value = {
    showSuccessToast,
    showErrorToast,
  };

  return (
    <ToastContext.Provider value={value}>
      <Toaster
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#27272a', // zinc-800
            color: '#e4e4e7', // zinc-200
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', // green-500
              secondary: '#1f2937', // gray-800
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#1f2937', // gray-800
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}
export function useToasts() {
  return useContext(ToastContext);
}