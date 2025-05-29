import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        analyser.fftSize = 2048;
        source.connect(analyser);
        
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        
        draw();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#4A90E2';
      ctx.beginPath();

      const sliceWidth = WIDTH / dataArrayRef.current.length;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = v * HEIGHT / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    setupAudio();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <Card title="Audio Waveform" size="small">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={{ width: '100%', height: 200, borderRadius: 8 }}
      />
    </Card>
  );
};

export default AudioVisualizer;