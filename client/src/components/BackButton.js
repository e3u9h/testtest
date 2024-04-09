import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="btn btn-light" style={{ borderColor: ' #6c757d', width: '130px', fontSize: '18px', margin: '20px', borderRadius: '30px' }}>
            Return
        </button>
    );
}

export default BackButton;