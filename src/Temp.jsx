

import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

function FaceDetection() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRefB = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      await loadModels();
      await startVideo();
    };
    loadModelsAndStartVideo();
    return () => {
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

    intervalRefB.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options());
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      resizedDetections.forEach(detection => {
        const box = detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: "" });
        drawBox.draw(canvas);
      });
    }, 100);
  };

  return (
    <>
      <div className='flex justify-center items-center h-screen w-screen overflow-hidden'>
        <video ref={videoRef} autoPlay muted className='h-full object-cover z-0'></video>
      </div>
    </>
  );
};

export default FaceDetection;