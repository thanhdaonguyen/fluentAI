import React, { useEffect, useRef, useState } from 'react';
import { Card, Slider, Typography, Switch, Space } from 'antd';

const { Text } = Typography;

interface DAFProcessorProps {
  isActive: boolean;
  delay: number;
}

const DAFProcessor: React.FC<DAFProcessorProps> = ({ isActive, delay: initialDelay }) => {
  const [delay, setDelay] = useState(initialDelay);
  const [volume, setVolume] = useState(0.7);
  const [isEnabled, setIsEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive || !isEnabled) {
      // Clean up audio when stopping
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      return;
    }

    const setupDAF = async () => {
      try {
        // Get microphone input
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          } 
        });
        streamRef.current = stream;

        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create nodes
        const source = audioContext.createMediaStreamSource(stream);
        const delayNode = audioContext.createDelay(1); // Max 1 second delay
        const gainNode = audioContext.createGain();

        // Set delay time (convert ms to seconds)
        delayNode.delayTime.value = delay / 1000;
        
        // Set gain (volume)
        gainNode.gain.value = volume;

        // Connect nodes: source -> delay -> gain -> output
        source.connect(delayNode);
        delayNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Store references
        sourceRef.current = source;
        delayNodeRef.current = delayNode;
        gainNodeRef.current = gainNode;

      } catch (error) {
        console.error('Error setting up DAF:', error);
      }
    };

    setupDAF();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isActive, delay, volume, isEnabled]);

  // Update delay when it changes
  useEffect(() => {
    if (delayNodeRef.current) {
      delayNodeRef.current.delayTime.value = delay / 1000;
    }
  }, [delay]);

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return (
    <Card title="DAF Settings" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Enable DAF</Text>
          <Switch 
            checked={isEnabled} 
            onChange={setIsEnabled}
            disabled={!isActive}
          />
        </div>
        
        <div>
          <Text>Delay: {delay}ms</Text>
          <Slider
            min={50}
            max={200}
            value={delay}
            onChange={setDelay}
            disabled={!isActive || !isEnabled}
            marks={{
              50: '50ms',
              100: '100ms',
              150: '150ms',
              200: '200ms',
            }}
            tooltip={{ formatter: (value) => `${value}ms` }}
          />
        </div>
        
        <div>
          <Text>Volume: {Math.round(volume * 100)}%</Text>
          <Slider
            min={0}
            max={100}
            value={volume * 100}
            onChange={(value) => setVolume(value / 100)}
            disabled={!isActive || !isEnabled}
            tooltip={{ formatter: (value) => `${value}%` }}
          />
        </div>
        
        <Text type="secondary" style={{ fontSize: 12 }}>
          Delayed Auditory Feedback helps improve speech fluency by playing back your voice with a slight delay.
        </Text>
      </Space>
    </Card>
  );
};

export default DAFProcessor;