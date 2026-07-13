import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 50, color = "#667eea", loading = true, text = "Loading..." }) => {
    return (
        <div style={styles.container}>
            <ClipLoader color={color} loading={loading} size={size} />
            <p style={styles.text}>{text}</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        width: '100%',
    },
    text: {
        marginTop: '15px',
        color: '#888',
        fontSize: '14px',
    },
};

export default LoadingSpinner;