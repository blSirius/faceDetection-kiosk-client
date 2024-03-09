// Greeting.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { emoji } from './Emoji';
import Lottie from 'lottie-react';

import animetion from './assets/Animation - 1709720862320.json'

function Greeting({ getFaceDataSignal }) {
    const [faceData, setFaceData] = useState([]);

    const fetchFaceData = async () => {
        try {
            const data = await axios.get(import.meta.env.VITE_SERVER_API + '/fetch_face_data');
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
                <div className='flex flex-col items-center space-y-4 py-4 z-20 absolute top-0 right-0 m-2 overflow-auto max-h-full'>
                    <Lottie className='w-44 h-44' animationData={animetion} />
                    {faceData.map((data, index) => (
                        <div className='flex items-center border-2 p-2 rounded-full bg-white shadow-md w-full max-w-xs md:max-w-sm lg:max-w-md' key={index}>
                            <img className='w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-300' src={`${import.meta.env.VITE_SERVER_API}/fetch_face_image/${encodeURIComponent(data.path)}`} alt={data.name || 'Detected face'} />
                            <div className='flex flex-grow items-center mx-4'>
                                <div className='flex flex-col'>
                                    {data.name &&
                                        <div className='font-mono' >
                                            <span className='font-semibold' >{data.name}</span>
                                            <span>({Math.floor(data.age)})</span>
                                            <span>({data.gender})</span>
                                            <div>{data.greeting && <div className='text-gray-600'>{data.greeting}</div>}</div>
                                        </div>}
                                </div>

                                <div className='flex flex-col items-end flex-grow'>
                                    <div className='m-2'>{emoji(data.expression)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-4'>Empty</div>
            )}
        </>
    );
}

export default Greeting;