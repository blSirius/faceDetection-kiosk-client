import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import FaceDetectionCSS from './style/FaceDetection.module.css';
import axios from 'axios';

const FaceDetection = () => {
  const videoHeight = 480;
  const videoWidth = 640;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const [screenshotURL, setScreenshotURL] = useState(''); // Added state for screenshot URL

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      await loadModels();
      await startVideo();
    };
    loadModelsAndStartVideo();
    return () => {
      intervalRef.current && clearInterval(intervalRef.current); // Cleanup interval on component unmount
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
    document.body.appendChild(canvas); // Append canvas to body
    canvasRef.current = canvas;

    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options());
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      if (detections.length > 0) {
        videoScreenshot();
      }
    }, 2000);
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
      const screenshotURL = URL.createObjectURL(blob);
      setScreenshotURL(screenshotURL); // Update state with new screenshot URL
      prediction(file);
    }, 'image/jpeg');
  };

  const prediction = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(import.meta.env.VITE_API+'/prediction', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
    } catch (error) {
      console.error('Prediction error', error);
    }
  };

  return (
    <>
      <div className={FaceDetectionCSS.frame}>
        <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} className={FaceDetectionCSS.video}></video>
      </div>

      <img src={screenshotURL}  alt="" />
    </>
  );
};

export default FaceDetection;