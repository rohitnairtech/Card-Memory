import React from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryPixelButton = () => {
    const navigate = useNavigate();

    const handleHistory = () => {
        navigate('/history');
    };

    return (
        <button
            onClick={handleHistory}
            className="inline-block bg-[#2c2c54] text-white font-['Press_Start_2P',cursive] text-sm px-8 py-4 border-2 border-[#00d9ff] rounded-lg shadow-md cursor-pointer text-center transition-all hover:bg-[#40407a] hover:border-[#00aaff] hover:shadow-lg active:transform active:scale-95"
        >
           View History
        </button>
    );
};

export default HistoryPixelButton;