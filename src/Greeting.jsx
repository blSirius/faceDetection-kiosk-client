import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { emoji } from './Emoji';

// let timeoutID;

function Greeting({ getFaceDataSignal, newCard }) {
    const [faceData, setFaceData] = useState([]);

    const fetchFaceData = async () => {

        // if (newCard == 0) {
        //     return;
        // }

        try {
            // clearTimeout(timeoutID);

            const url = `${import.meta.env.VITE_SERVER_API}/fetch_face_data`;
            const response = await axios.post(url, { newCard });

            setFaceData(response.data);

            // timeoutID = setTimeout(() => {
            //     setFaceData([]);
            // }, 30000);
        } catch (error) {
            console.log(error);
        }
    };
    ;

    useEffect(() => {
        fetchFaceData();
    }, [getFaceDataSignal]);

    useEffect(() => {
        fetchFaceData();
    });

    return (
        <>
            {faceData.length > 0 ? (
                <div className='flex justify-center items-start z-20 absolute inset-x-0 bottom-0 overflow-auto'>
                    {faceData.map((data, index) => (
                        <div className='relative grid grid-cols-3 items-center p-2  rounded-xl shadow-lg' key={index} style={{ margin: '10px', border: '1px solid #eaeaea', borderRadius: '15px' }}>

                            <div className='absolute inset-0 bg-white opacity-75 rounded-xl'></div>

                            <div className='relative z-10'>
                                <img className='col-span-1 w-16 h-16 md:w-16 md:h-16 rounded-full border-2 border-gray-300' src={`${import.meta.env.VITE_SERVER_API}/fetch_face_image/${encodeURIComponent(data.path)}`} alt={data.name || 'Detected face'} />
                            </div>

                            <div className='col-start-2 col-span-2 flex flex-col ml-1 justify-start relative z-10'>
                                <div className='font-mono text-sm'>
                                    <span className='font-bold'>{data.name}</span>
                                </div>
                            </div>

                            <div className='col-span-4 flex items-center justify-between  pr-2 relative z-10'>
                                <div className=' text-gray-600 pr-1'>{data.greeting}</div>
                                <div>{emoji(data.expression)}</div>
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