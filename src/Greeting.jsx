// Greeting.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { emoji } from './Emoji';
import Lottie from 'lottie-react';

import animetion from './assets/Animation - 1709720862320.json'

function Greeting({ getFaceDataSignal, newCard }) {
    const [faceData, setFaceData] = useState([]);

    const fetchFaceData = async () => {
        try {
            if(newCard == 0){return}
            const data = await axios.post(import.meta.env.VITE_SERVER_API + '/fetch_face_data', { newCard });
            setFaceData(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFaceData();
    }, [getFaceDataSignal]);

    return (
        <>
            {faceData.length > 0 ? (
                <div className='flex justify-center items-end z-20 absolute inset-x-0 bottom-0 overflow-auto'>
                    {faceData.map((data, index) => (
                        <div className='flex items-center p-1 rounded-xl bg-white shadow-md' key={index}>
                            <div className='flex items-center space-x-2'>
                                <div className='flex flex-col'>
                                    {data.name &&
                                        <div className='font-mono text-xs'>
                                            <span className='font-bold'>{data.name}</span>
                                            <span>({Math.floor(data.age)})</span>
                                            <span>({data.gender})</span>
                                            <span className=''>{data.greeting}</span>
                                        </div>}
                                </div>
                                <img className='w-12 h-12 md:w-12 md:h-12 rounded-xl ' src={`${import.meta.env.VITE_SERVER_API}/fetch_face_image/${encodeURIComponent(data.path)}`} alt={data.name || 'Detected face'} />
                                <div className='flex flex-col items-end'>
                                    <div>{emoji(data.expression)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center h-full'>Empty</div>
            )}
        </>
    );
}

export default Greeting;