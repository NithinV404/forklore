import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    const showToast = (message: string) => {
        setMessage(message);
        setIsVisible(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {isVisible && <Toast message={message} />}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}