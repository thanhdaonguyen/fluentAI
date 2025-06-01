import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';

interface AudioVisualizerProps {
  isActive: boolean;
  stream: MediaStream | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if(sourceRef.current && analyserRef.current) {
        sourceRef.current.disconnect();
      }

      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
      analyserRef.current = null;
      sourceRef.current = null;
      audioContextRef.current = null;
    };

    if (!isActive || !stream) {
      cleanup();
      return;
    }

    const setupAudio = async () => {
      try {
        // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const analyser = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        
        analyser.fftSize = 2048;
        source.connect(analyser);
        
        analyserRef.current = analyser;
        sourceRef.current = source;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        
        draw();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        cleanup();
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
      cleanup();
    };
  }, [isActive, stream]);

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