import React, { useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
    const [showToast, setShowToast] = useState<boolean>(false);

    const displayToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
    }

    // Call the displayToast function when the component receives a new message
    React.useEffect(() => {
        displayToast();
    }, [message]);

    return (
        <div>
            {showToast && <div className={styles.toast}>{message}</div>}
        </div>
    );
}

export default Toast;