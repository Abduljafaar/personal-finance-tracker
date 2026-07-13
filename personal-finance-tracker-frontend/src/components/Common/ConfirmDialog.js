import React from 'react';

const ConfirmDialog = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm', 
    message = 'Are you sure?', 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    confirmColor = '#e74c3c'
}) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.message}>{message}</p>
                <div style={styles.buttons}>
                    <button onClick={onClose} style={styles.cancelBtn}>
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} style={{...styles.confirmBtn, background: confirmColor}}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    dialog: {
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
        fontSize: '20px',
    },
    message: {
        margin: '0 0 20px 0',
        color: '#666',
        fontSize: '16px',
        lineHeight: '1.5',
    },
    buttons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
    },
    cancelBtn: {
        padding: '10px 20px',
        background: '#95a5a6',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    confirmBtn: {
        padding: '10px 20px',
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default ConfirmDialog;