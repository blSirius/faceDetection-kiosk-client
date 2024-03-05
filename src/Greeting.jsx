import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function Greeting({ getFaceDataSignal }) {
    const [faceData, setFaceData] = useState([]);

    const fetchFaceData = async () => {
        try {
            const data = await axios.get(import.meta.env.VITE_API + '/fetch_face_data');
            setFaceData(data.data);
            console.log('fetch');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFaceData();
    }, [getFaceDataSignal]);

    return (
        <>
            {faceData ?
                (
                    <div> {faceData.map((data, index) => (
                        <div key={index}>
                            <div>{data.name}</div>
                            <div>{data.expression}</div>
                            <div>{data.age}</div>
                            <div>{data.gender}</div>
                            <div>{data.date}</div>
                            <div>{data.time}</div>
                            <div>{data.path}</div>
                            <div><img src={`${import.meta.env.VITE_API}/fetch_face_image/${encodeURIComponent(data.path)}`} alt={data.name} /></div>
                            <hr />
                        </div>
                    ))}
                    </div>
                )
                :
                (<div>emthy</div>)}
        </>
    );
}
export default Greeting;