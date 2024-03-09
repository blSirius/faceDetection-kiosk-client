import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import Greeting from './Greeting';

function FaceDetection() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRefA = useRef(null);
  const intervalRefB = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

  const [getFaceDataSignal, setGetFaceDataSignal] = useState(false);

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      await loadModels();
      await startVideo();
    };
    loadModelsAndStartVideo();
    return () => {
      intervalRefA.current && clearInterval(intervalRefA.current);
      intervalRefB.current && clearInterval(intervalRefB.current);
    };
  }, []);

  useEffect(() => {
    const playListener = () => runFaceRecognition();
    if (videoRef.current) {
      videoRef.current.addEventListener('play', playListener);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', playListener);
      }
    };
  }, [videoRef.current]);

  const loadModels = async () => {
    const MODEL_URL = '/models';
    try {
      await Promise.all([faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)]);
    } catch (error) {
      console.error('Failed to load models', error);
    }
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;

    } catch (error) {
      console.error('Failed to start video stream', error);
    }
  };

  const runFaceRecognition = async () => {
    if (!videoRef.current) return;

    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    canvas.className = "absolute top-0 left-1/2 transform -translate-x-1/2 z-10 h-full object-cover";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    intervalRefA.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options());
      if (detections.length > 0) {
        videoScreenshot();
      }
    }, 3000);

    intervalRefB.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options());
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 100);
  };

  const videoScreenshot = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    canvas.toBlob(blob => {
      const file = new File([blob], "label.jpg", { type: "image/jpeg" });
      prediction(file);
    }, 'image/jpeg');
  };

  const prediction = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_API + '/prediction', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
      setGetFaceDataSignal(prev => !prev);

    } catch (error) {
      console.error('Prediction error', error);
    }
  };

  return (
    <>

      <div className='flex justify-center items-center h-screen w-screen overflow-hidden'>
        <video ref={videoRef} autoPlay muted className='h-full object-cover z-0'></video>
      </div>


      <Greeting getFaceDataSignal={getFaceDataSignal} />
    </>
  );
};

export default FaceDetection;