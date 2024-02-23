import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import styles from './BoundingBoxViewer.module.css'
const BoundingBoxViewer = ({videoURL, boundingBoxes}) => {
  // console.log(boundingBoxes[1])
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const clickVideo = () => {
    console.log('click');
  
    const video = videoRef.current;
  
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };
  
  // const boundingBoxes = {
  //   1: { x: 50, y: 50, width: 50, height: 50 },
  //   5: { x: 50, y: 50, width: 50, height: 50 },
  //   7: { x: 50, y: 50, width: 50, height: 50 },
  //   10: { x: 50, y: 50, width: 50, height: 50 },
  // };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawBoundingBox = (box) => {
      ctx.strokeStyle = box.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    };

    const drawBoundingBoxes = (frame) => {
      const boxes = boundingBoxes[frame];
      if(!boxes){
        return
      }
      boxes.forEach(box => {
        drawBoundingBox(box)
      });
    };

    video.addEventListener('loadedmetadata', () => {
      // canvas.width = video.videoWidth;
      // canvas.height = video.videoHeight;
      canvas.width = 640;
      canvas.height = 360;

    });

    let animationFrameId;
    const render = () => {
      const currentTime = video.currentTime;
      const currentFrame = Math.floor(currentTime * 10)+1; // Calculate frame based on 10 fps
      // console.log(video.currentTime)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBoundingBoxes(currentFrame);

      animationFrameId = requestAnimationFrame(render);
    };

    video.addEventListener('play', () => {
      animationFrameId = requestAnimationFrame(render);
    });

    video.addEventListener('pause', () => {
      cancelAnimationFrame(animationFrameId);
    });

    video.addEventListener('seeked', () => {
      const currentTime = video.currentTime;
      const currentFrame = Math.floor(currentTime * 10); // Calculate frame based on 10 fps

      // Update the bounding boxes based on the new current time
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBoundingBoxes(currentFrame);
    });

    return () => {
      video.removeEventListener('loadedmetadata', () => {});
      video.removeEventListener('play', () => {});
      video.removeEventListener('pause', () => {});
      video.removeEventListener('seeked', () => {});
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className={styles.mainContainer}>
      <video className={styles.video} ref={videoRef} width="640" height="360" controls>
        <source src={videoURL} type="video/mp4" />
      </video>
      <div className={styles.bboxLayerContainer} onClick={() => clickVideo()}>

        <canvas className={styles.bboxLayer} ref={canvasRef}/>
      </div>
    </div>
  );
};

export default BoundingBoxViewer;
